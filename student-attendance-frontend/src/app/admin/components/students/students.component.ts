import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { AdminService } from '../../../core/services/admin.service';
// --- IMPORT THE NEW API RESPONSE MODEL ---
import { StudentApiResponse } from '../../../core/models/student.model';

/**
 * This is your component's internal model (nested)
 * This is fine to keep as-is.
 */
interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  parentEmail: string;
  classEntity: {
    id: number;
    className: string;
    section: string;
  } | null;
}

interface ClassOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    FilterPipe,
  ],
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  classes: ClassOption[] = [];

  isLoading = true;
  isAddingStudent = false;
  isEditing = false;
  currentStudentId: number | null = null;

  searchTerm = '';
  errorMessage = '';
  successMessage = '';

  studentForm: FormGroup;
  showConfirmation = false;
  studentToDelete: Student | null = null;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      rollNumber: ['', [Validators.required]],
      parentEmail: ['', [Validators.email]],
      classId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    // Chain the calls: Load classes first, THEN load students
    this.adminService.getAllClasses().subscribe({
      next: (data: any[]) => {
        this.classes = data.map((cls: any) => ({
          id: cls.id,
          name: `${cls.className} - ${cls.section}`,
        }));
        // Now that classes are loaded, load students
        this.loadStudents();
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load classes. ' +
          (err?.error?.message || err.message || '');
        this.isLoading = false; // Stop loading if classes fail
      },
    });
  }

  /**
   * --- THIS METHOD IS NOW FIXED ---
   */
  loadStudents(): void {
    this.isLoading = true; // Ensure loading is true
    this.adminService.getAllStudents().subscribe({
      // 1. Use the correct API response type
      next: (data: StudentApiResponse[]) => {
        // 2. Map the FLAT response (StudentApiResponse) to your NESTED component interface (Student)
        const mapped: Student[] = data.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          phone: s.phone ?? '',
          rollNumber: s.rollNumber ?? '',
          parentEmail: s.parentEmail ?? '',
          // 3. Manually build the classEntity object from flat properties
          classEntity:
            s.classId && s.className && s.section
              ? {
                  id: s.classId,
                  className: s.className,
                  section: s.section,
                }
              : null, // If any part is missing, set to null
        }));

        this.students = mapped;
        this.filteredStudents = mapped;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load students. ' +
          (err?.error?.message || err.message || '');
        this.isLoading = false;
      },
    });
  }

  // loadClasses() is no longer needed separately

  onSearchChange(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredStudents = this.students;
      return;
    }
    this.filteredStudents = this.students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.rollNumber.toLowerCase().includes(term)
    );
  }

  addStudent(): void {
    this.isAddingStudent = true;
    this.isEditing = false;
    this.currentStudentId = null;
    this.studentForm.reset();

    this.password?.setValidators([Validators.required]);
    this.password?.updateValueAndValidity();
    this.password?.enable();
  }

  editStudent(student: Student): void {
    this.isAddingStudent = true;
    this.isEditing = true;
    this.currentStudentId = student.id;

    this.studentForm.patchValue({
      name: student.name,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
      parentEmail: student.parentEmail,
      classId: student.classEntity?.id ?? null,
    });

    this.password?.clearValidators();
    this.password?.updateValueAndValidity();
    this.password?.disable();
  }

  cancelAddStudent(): void {
    this.isAddingStudent = false;
    this.isEditing = false;
    this.currentStudentId = null;
    this.studentForm.reset();
  }

  onSubmitStudent(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const payload = this.studentForm.getRawValue();

    if (this.isEditing && this.currentStudentId) {
      if (!payload.password) {
        delete payload.password;
      }
      this.adminService
        .updateStudent(this.currentStudentId, payload)
        .subscribe({
          next: () => {
            this.loadStudents(); // Reload students
            this.successMessage = 'Student updated successfully';
            this.cancelAddStudent();
            this.clearMessagesAfterDelay();
          },
          error: (err) => {
            this.errorMessage =
              'Failed to update student. ' +
              (err?.error?.message || err.message || '');
            this.isLoading = false;
            this.clearMessagesAfterDelay();
          },
        });
    } else {
      this.adminService.createStudent(payload).subscribe({
        next: () => {
          this.loadStudents(); // Reload students
          this.successMessage = 'Student added successfully';
          this.cancelAddStudent();
          this.clearMessagesAfterDelay();
        },
        error: (err) => {
          this.errorMessage =
            'Failed to add student. ' +
            (err?.error?.message || err.message || '');
          this.isLoading = false;
          this.clearMessagesAfterDelay();
        },
      });
    }
  }

  confirmDeleteStudent(student: Student): void {
    this.studentToDelete = student;
    this.showConfirmation = true;
  }

  onDeleteConfirmed(): void {
    if (!this.studentToDelete) return;
    const id = this.studentToDelete.id;
    this.isLoading = true;

    this.adminService.deleteStudent(id).subscribe({
      next: () => {
        this.students = this.students.filter((s) => s.id !== id);
        this.filteredStudents = [...this.students];
        this.showConfirmation = false;
        this.studentToDelete = null;
        this.successMessage = 'Student deleted successfully';
        this.isLoading = false;
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        this.errorMessage =
          'Failed to delete student. ' +
          (err?.error?.message || err.message || '');
        this.isLoading = false;
        this.showConfirmation = false;
        this.clearMessagesAfterDelay();
      },
    });
  }

  onDeleteCancelled(): void {
    this.showConfirmation = false;
    this.studentToDelete = null;
  }

  private markFormGroupTouched(): void {
    Object.values(this.studentForm.controls).forEach((c) => c.markAsTouched());
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  // Getters for template
  get name() {
    return this.studentForm.get('name');
  }
  get email() {
    return this.studentForm.get('email');
  }
  get password() {
    return this.studentForm.get('password');
  }
  get phone() {
    return this.studentForm.get('phone');
  }
  get rollNumber() {
    return this.studentForm.get('rollNumber');
  }
  get parentEmail() {
    return this.studentForm.get('parentEmail');
  }
  get classId() {
    return this.studentForm.get('classId');
  }
}
