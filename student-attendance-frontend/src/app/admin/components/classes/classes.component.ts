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

interface ClassModel {
  id: number;
  className: string;
  section: string;
  academicYear: string;
  semester: string;
}

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
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
export class ClassesComponent implements OnInit {
  classes: ClassModel[] = [];
  filteredClasses: ClassModel[] = [];

  isLoading = false;
  isAddingClass = false;
  isEditing = false;
  currentClassId: number | null = null;

  searchTerm = '';
  errorMessage = '';
  successMessage = '';

  classForm: FormGroup;

  showConfirmation = false;
  classToDelete: ClassModel | null = null;

  academicYears = ['2024-2025', '2025-2026', '2026-2027'];
  semesters = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester',
  ];

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.classForm = this.fb.group({
      className: ['', Validators.required],
      section: ['', Validators.required],
      academicYear: [null, Validators.required],
      semester: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.isLoading = true;
    this.adminService.getAllClasses().subscribe({
      next: (data: any[]) => {
        // Ensure we map to the expected shape (id present)
        this.classes = (data || []).map((c: any) => ({
          id: c.id,
          className: c.className,
          section: c.section,
          academicYear: c.academicYear,
          semester: c.semester,
        }));
        this.filteredClasses = [...this.classes];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load classes. ' +
          (err?.error?.message || err.message || '');
        this.isLoading = false;
        this.clearMessagesAfterDelay();
      },
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredClasses = [...this.classes];
      return;
    }
    this.filteredClasses = this.classes.filter(
      (c) =>
        c.className.toLowerCase().includes(term) ||
        c.section.toLowerCase().includes(term) ||
        c.academicYear.toLowerCase().includes(term)
    );
  }

  addClass(): void {
    this.isAddingClass = true;
    this.isEditing = false;
    this.currentClassId = null;
    this.classForm.reset();
  }

  editClass(classItem: ClassModel): void {
    this.isAddingClass = true;
    this.isEditing = true;
    this.currentClassId = classItem.id;

    this.classForm.patchValue({
      className: classItem.className,
      section: classItem.section,
      academicYear: classItem.academicYear,
      semester: classItem.semester,
    });
  }

  cancelAddClass(): void {
    this.isAddingClass = false;
    this.isEditing = false;
    this.currentClassId = null;
    this.classForm.reset();
  }

  onSubmitClass(): void {
    if (this.classForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const payload = this.classForm.value;
    this.isLoading = true;

    if (this.isEditing && this.currentClassId != null) {
      // UPDATE
      this.adminService.updateClass(this.currentClassId, payload).subscribe({
        next: () => {
          this.successMessage = 'Class updated successfully';
          this.cancelAddClass();
          this.loadClasses(); // refresh list
          this.clearMessagesAfterDelay();
        },
        error: (err) => {
          this.errorMessage =
            'Failed to update class. ' +
            (err?.error?.message || err.message || '');
          this.isLoading = false;
          this.clearMessagesAfterDelay();
        },
      });
    } else {
      // CREATE
      this.adminService.createClass(payload).subscribe({
        next: () => {
          this.successMessage = 'Class added successfully';
          this.cancelAddClass();
          this.loadClasses(); // refresh list
          this.clearMessagesAfterDelay();
        },
        error: (err) => {
          this.errorMessage =
            'Failed to add class. ' +
            (err?.error?.message || err.message || '');
          this.isLoading = false;
          this.clearMessagesAfterDelay();
        },
      });
    }
  }

  confirmDeleteClass(classItem: ClassModel): void {
    this.classToDelete = classItem;
    this.showConfirmation = true;
  }

  onDeleteConfirmed(): void {
    if (!this.classToDelete) return;
    const id = this.classToDelete.id;

    this.isLoading = true;
    this.adminService.deleteClass(id).subscribe({
      next: () => {
        // Update UI immediately
        this.classes = this.classes.filter((c) => c.id !== id);
        this.filteredClasses = [...this.classes];

        this.successMessage = 'Class deleted successfully';
        this.isLoading = false;
        this.showConfirmation = false;
        this.classToDelete = null;
        this.clearMessagesAfterDelay();
      },
      error: (err) => {
        this.errorMessage =
          'Failed to delete class. ' +
          (err?.error?.message || err.message || '');
        this.isLoading = false;
        this.showConfirmation = false;
        this.classToDelete = null;
        this.clearMessagesAfterDelay();
      },
    });
  }

  onDeleteCancelled(): void {
    this.showConfirmation = false;
    this.classToDelete = null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.classForm.controls).forEach((key) => {
      this.classForm.get(key)?.markAsTouched();
    });
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 4000);
  }

  // Safer, explicit getters for template
  get classNameCtrl() {
    return this.classForm.get('className');
  }
  get sectionCtrl() {
    return this.classForm.get('section');
  }
  get academicYearCtrl() {
    return this.classForm.get('academicYear');
  }
  get semesterCtrl() {
    return this.classForm.get('semester');
  }
}
