import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './mark-attendance.component.html',
  styleUrls: ['./mark-attendance.component.css'],
})
export class MarkAttendanceComponent implements OnInit {
  courses: any[] = [];
  selectedCourseId: number | null = null;
  attendanceDate: string = new Date().toISOString().split('T')[0];

  attendanceForm: FormGroup;
  isLoading = false;
  isSubmitting = false;
  isUpdateMode = false;

  // ✅ LOCK STATE
  isLocked = false;
  unlockReason = '';

  // Messages & Modals
  errorMessage = '';
  successMessage = '';
  showConfirmModal = false;

  totalPresent = 0;
  totalAbsent = 0;

  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.attendanceForm = this.fb.group({ attendanceList: this.fb.array([]) });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.route.queryParams.subscribe((params) => {
      if (params['courseId']) {
        this.selectedCourseId = +params['courseId'];
        if (params['date']) this.attendanceDate = params['date'];
        if (params['mode'] === 'edit') this.isUpdateMode = true;
        this.checkRulesAndLoad();
      }
    });
  }

  loadCourses() {
    this.teacherService
      .getTeacherCourses()
      .subscribe((data) => (this.courses = data));
  }

  get attendanceList(): FormArray {
    return this.attendanceForm.get('attendanceList') as FormArray;
  }

  onCourseSelect() {
    if (this.selectedCourseId) this.checkRulesAndLoad();
  }

  checkRulesAndLoad() {
    if (!this.selectedCourseId) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.isLocked = false;
    this.attendanceList.clear();

    // 1. Check Backend Rules (Enforces 15-min Limit)
    this.teacherService
      .checkAttendanceRules(
        this.selectedCourseId!,
        this.attendanceDate,
        this.isUpdateMode
      )
      .subscribe({
        next: (allowed) => {
          if (allowed) {
            // Allowed: Load Data
            this.loadData();
          } else {
            // 🔴 Denied: Lock Screen
            this.isLocked = true;
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Rule Check Failed:', err);
          this.isLoading = false;
          this.errorMessage = 'Error checking attendance rules.';
        },
      });
  }

  loadData() {
    // Check if data exists to confirm update mode logic
    this.teacherService
      .getClassAttendance(this.selectedCourseId!, this.attendanceDate)
      .subscribe({
        next: (data) => {
          const hasData = data && data.length > 0 && data[0].status !== null;
          this.isUpdateMode = hasData;

          if (this.isUpdateMode) {
            this.populateForm(data);
          } else {
            this.loadFreshStudents();
          }
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load class data.';
        },
      });
  }

  loadFreshStudents() {
    this.teacherService
      .getStudentsByCourse(this.selectedCourseId!)
      .subscribe((students) => {
        const freshData = students.map((s) => ({
          studentId: s.studentId || s.id,
          studentName: s.studentName || s.name,
          rollNumber: s.rollNumber,
          status: 'PRESENT',
        }));
        this.populateForm(freshData);
      });
  }

  populateForm(data: any[]) {
    this.attendanceList.clear();
    data.forEach((s) => {
      this.attendanceList.push(
        this.fb.group({
          studentId: [s.studentId],
          studentName: [s.studentName],
          rollNumber: [s.rollNumber],
          status: [s.status || 'PRESENT', Validators.required],
        })
      );
    });
    this.calculateStats();
    this.isLoading = false;
  }

  markAll(status: string) {
    this.attendanceList.controls.forEach((ctrl) => ctrl.patchValue({ status }));
    this.calculateStats();
  }

  calculateStats() {
    const vals = this.attendanceForm.value.attendanceList;
    this.totalPresent = vals.filter((s: any) => s.status === 'PRESENT').length;
    this.totalAbsent = vals.filter((s: any) => s.status === 'ABSENT').length;
  }

  onPreSubmit() {
    if (this.attendanceForm.invalid) return;
    if (this.totalAbsent > 0) this.showConfirmModal = true;
    else this.submitFinal(false);
  }

  submitFinal(notifyParents: boolean) {
    this.showConfirmModal = false;
    this.isSubmitting = true;

    const payload = {
      courseId: this.selectedCourseId,
      date: this.attendanceDate,
      notifyParents: notifyParents,
      attendanceList: this.attendanceForm.value.attendanceList,
    };

    const req$ = this.isUpdateMode
      ? this.teacherService.updateAttendance(payload)
      : this.teacherService.markAttendance(payload);

    req$.subscribe({
      next: () => {
        this.successMessage = 'Saved Successfully!';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/teacher/dashboard']), 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error || err.message || 'Failed to save.';
      },
    });
  }

  // ✅ Unlock Request from Mark Page
  sendUnlockRequest() {
    if (!this.unlockReason.trim()) {
      alert('Please enter a reason.');
      return;
    }
    const payload = {
      courseId: this.selectedCourseId,
      date: this.attendanceDate,
      reason: this.unlockReason,
      requestType: this.isUpdateMode ? 'UPDATE_UNLOCK' : 'LATE_MARKING',
    };

    this.teacherService.createUnlockRequest(payload).subscribe({
      next: () => {
        alert('Unlock Request Sent! Admin will review it.');
        this.router.navigate(['/teacher/dashboard']);
      },
      error: () => alert('Failed to send request.'),
    });
  }

  closeModals() {
    this.showConfirmModal = false;
  }
}
