import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

interface LeaveRequest {
  id: number;
  courseName?: string;
  courseCode?: string;
  startDate: string;
  endDate: string;
  reason: string;
  proofDocument?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  teacherName?: string;
  remarks?: string;
}

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    DateFormatPipe,
  ],
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  courses: any[] = []; // Courses for dropdown

  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  leaveForm: FormGroup;
  showLeaveForm = false;
  showConfirmation = false;
  requestToDelete: LeaveRequest | null = null;

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder
  ) {
    this.leaveForm = this.formBuilder.group({
      courseId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      proofDocument: [''],
    });
  }

  ngOnInit(): void {
    this.loadCourses();
    this.loadLeaveRequests();
  }

  loadCourses() {
    this.studentService.getStudentDashboard().subscribe({
      next: (data) => {
        this.courses = data.courseAttendances.map((c: any) => ({
          id: c.courseId,
          name: c.courseName,
          code: c.courseCode,
        }));
      },
    });
  }

  loadLeaveRequests(): void {
    this.isLoading = true;
    this.studentService.getLeaveRequests().subscribe({
      next: (data) => {
        this.leaveRequests = data.map((req: any) => ({
          ...req,
          courseName: req.course?.courseName,
          courseCode: req.course?.courseCode,
          teacherName: req.teacher?.name,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load requests.';
        this.isLoading = false;
      },
    });
  }

  openLeaveForm(): void {
    this.showLeaveForm = true;
    this.leaveForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeLeaveForm(): void {
    this.showLeaveForm = false;
  }

  onSubmitLeave(): void {
    if (this.leaveForm.valid) {
      this.isSubmitting = true;
      const payload = this.leaveForm.value;

      this.studentService.createLeaveRequest(payload).subscribe({
        next: (newReq) => {
          this.isSubmitting = false;
          this.showLeaveForm = false;
          this.successMessage = 'Request submitted successfully!';
          this.loadLeaveRequests();
          this.clearMessagesAfterDelay();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to submit request.';
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // --- Helpers ---
  getPendingRequests(): LeaveRequest[] {
    return this.leaveRequests.filter((req) => req.status === 'PENDING');
  }

  getProcessedRequests(): LeaveRequest[] {
    return this.leaveRequests.filter((req) => req.status !== 'PENDING');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'fas fa-clock';
      case 'APPROVED':
        return 'fas fa-check-circle';
      case 'REJECTED':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  }

  getTotalDays(from: string, to: string): number {
    const start = new Date(from);
    const end = new Date(to);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
  }

  confirmDeleteRequest(request: LeaveRequest): void {
    this.requestToDelete = request;
    this.showConfirmation = true;
  }

  onDeleteConfirmed(): void {
    // Implement delete logic here if backend supports it
    this.showConfirmation = false;
  }

  onDeleteCancelled(): void {
    this.showConfirmation = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.leaveForm.controls).forEach((key) => {
      this.leaveForm.get(key)?.markAsTouched();
    });
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  get courseId() {
    return this.leaveForm.get('courseId');
  }
  get startDate() {
    return this.leaveForm.get('startDate');
  }
  get endDate() {
    return this.leaveForm.get('endDate');
  }
  get reason() {
    return this.leaveForm.get('reason');
  }
}
