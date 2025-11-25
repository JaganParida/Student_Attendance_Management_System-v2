import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import {
  UserInfoResponse,
  SignupRequest,
} from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css'],
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
export class TeachersComponent implements OnInit {
  teachers: UserInfoResponse[] = [];
  filteredTeachers: UserInfoResponse[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  searchTerm = '';

  isAddingTeacher = false;
  isEditingTeacher = false;
  teacherToEdit: UserInfoResponse | null = null;

  teacherForm: FormGroup;

  showConfirmation = false;
  teacherToDelete: UserInfoResponse | null = null;

  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.teacherForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      teacherId: ['', Validators.required],
      department: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.isLoading = true;
    this.adminService.getAllTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
        this.filteredTeachers = teachers;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load teachers';
        this.isLoading = false;
        this.clearMessagesAfterDelay();
      },
    });
  }

  onSearchChange(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredTeachers = this.teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.email.toLowerCase().includes(search) ||
        (t.teacherId?.toLowerCase() || '').includes(search)
    );
  }

  addTeacher(): void {
    this.isAddingTeacher = true;
    this.isEditingTeacher = false;
    this.teacherForm.reset();
  }

  editTeacher(teacher: UserInfoResponse): void {
    this.isEditingTeacher = true;
    this.isAddingTeacher = false;
    this.teacherToEdit = teacher;

    this.teacherForm.patchValue({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      teacherId: teacher.teacherId,
      department: teacher.department,
      password: '',
    });
  }

  cancelAddTeacher(): void {
    this.isAddingTeacher = false;
    this.isEditingTeacher = false;
    this.teacherForm.reset();
  }

  onSubmitTeacher(): void {
    if (this.teacherForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formData: SignupRequest = {
      ...this.teacherForm.value,
      role: 'TEACHER',
    };

    if (this.isAddingTeacher) {
      this.adminService.createTeacher(formData).subscribe({
        next: (newTeacher) => {
          this.teachers.push(newTeacher);
          this.filteredTeachers = this.teachers;
          this.successMessage = 'Teacher added successfully';
          this.cancelAddTeacher();
          this.clearMessagesAfterDelay();
        },
        error: () => {
          this.errorMessage = 'Failed to add teacher';
          this.clearMessagesAfterDelay();
        },
      });
    } else if (this.isEditingTeacher && this.teacherToEdit) {
      this.adminService
        .updateTeacher(this.teacherToEdit.id, formData)
        .subscribe({
          next: (updatedTeacher) => {
            const index = this.teachers.findIndex(
              (t) => t.id === updatedTeacher.id
            );
            if (index !== -1) this.teachers[index] = updatedTeacher;
            this.filteredTeachers = this.teachers;
            this.successMessage = 'Teacher updated successfully';
            this.cancelAddTeacher();
            this.clearMessagesAfterDelay();
          },
          error: () => {
            this.errorMessage = 'Failed to update teacher';
            this.clearMessagesAfterDelay();
          },
        });
    }
  }

  confirmDeleteTeacher(teacher: UserInfoResponse): void {
    this.teacherToDelete = teacher;
    this.showConfirmation = true;
  }

  // ✅ FIXED DELETE FUNCTION
  onDeleteConfirmed(): void {
    if (!this.teacherToDelete) return;

    this.adminService.deleteTeacher(this.teacherToDelete.id).subscribe({
      next: () => {
        this.removeTeacherFromList();
        this.showDeleteSuccess();
      },
      error: (error) => {
        if (error.status === 200 || error.status === 204) {
          this.removeTeacherFromList();
          this.showDeleteSuccess();
        } else {
          this.errorMessage = 'Failed to delete teacher';
          this.clearMessagesAfterDelay();
        }
      },
    });
  }

  private removeTeacherFromList() {
    this.teachers = this.teachers.filter(
      (t) => t.id !== this.teacherToDelete!.id
    );
    this.filteredTeachers = this.teachers;
    this.teacherToDelete = null;
    this.showConfirmation = false;
  }

  private showDeleteSuccess() {
    this.successMessage = 'Teacher deleted successfully';
    this.clearMessagesAfterDelay();
  }

  onDeleteCancelled(): void {
    this.showConfirmation = false;
    this.teacherToDelete = null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.teacherForm.controls).forEach((key) => {
      this.teacherForm.get(key)?.markAsTouched();
    });
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 4000);
  }
}
