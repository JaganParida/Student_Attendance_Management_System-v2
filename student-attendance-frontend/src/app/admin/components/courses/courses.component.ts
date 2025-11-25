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

// Interfaces
interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  shortName: string;
  description: string;
  teacherId: number | null;
  teacherName: string | null;
  classId: number | null;
  className: string | null;
  section: string | null;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classRoom: string;
  studentIds?: number[];
}

interface OptionItem {
  id: number;
  name: string;
  details?: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    FilterPipe,
  ],
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  isLoading = false;

  isAddingCourse = false;
  isEditing = false;
  currentCourseId: number | null = null;

  // Dropdown Options
  teachers: OptionItem[] = [];
  classes: OptionItem[] = [];
  students: OptionItem[] = [];

  // Dropdown State
  isStudentDropdownOpen = false;

  daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  searchTerm = '';
  errorMessage = '';
  successMessage = '';

  showConfirmation = false;
  courseToDelete: Course | null = null;

  courseForm: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.courseForm = this.fb.group({
      courseCode: ['', Validators.required],
      courseName: ['', Validators.required],
      shortName: ['', Validators.required],
      description: [''],
      teacherId: [null, Validators.required],
      classId: [null, Validators.required],

      dayOfWeek: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      classRoom: [''],

      studentIds: [[]],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;

    // Load Teachers
    this.adminService.getAllTeachers().subscribe((data) => {
      this.teachers = data.map((t: any) => ({
        id: t.id,
        name: t.name,
      }));
    });

    // Load Classes
    this.adminService.getAllClasses().subscribe((data) => {
      this.classes = data.map((cls: any) => ({
        id: cls.id,
        name: `${cls.className} - ${cls.section}`,
      }));
    });

    // Load Students
    this.adminService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          details: s.rollNumber,
        }));
      },
      error: () => console.error('Failed to load students'),
    });

    this.loadCourses();
  }

  loadCourses(): void {
    this.adminService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.filteredCourses = [...this.courses];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load courses';
        this.isLoading = false;
      },
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(
      (c) =>
        c.courseName.toLowerCase().includes(term) ||
        c.courseCode.toLowerCase().includes(term)
    );
  }

  // --- Add/Edit Logic ---

  addCourse(): void {
    this.isAddingCourse = true;
    this.isEditing = false;
    this.courseForm.reset();
    this.courseForm.patchValue({ studentIds: [] });
  }

  editCourse(course: Course): void {
    this.isAddingCourse = true;
    this.isEditing = true;
    this.currentCourseId = course.id;

    this.courseForm.patchValue({
      courseCode: course.courseCode,
      courseName: course.courseName,
      shortName: course.shortName,
      description: course.description,
      teacherId: course.teacherId,
      classId: course.classId,
      dayOfWeek: course.dayOfWeek,
      startTime: course.startTime,
      endTime: course.endTime,
      classRoom: course.classRoom,
      studentIds: course.studentIds || [],
    });
  }

  cancelAddCourse(): void {
    this.isAddingCourse = false;
    this.isEditing = false;
    this.currentCourseId = null;
    this.courseForm.reset();
  }

  onSubmitCourse(): void {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const data = this.courseForm.value;
    this.isLoading = true;

    if (this.isEditing && this.currentCourseId) {
      this.adminService.updateCourse(this.currentCourseId, data).subscribe({
        next: () => this.handleSuccess('Course updated successfully'),
        error: () => this.handleError('Failed to update course'),
      });
    } else {
      this.adminService.createCourse(data).subscribe({
        next: () => this.handleSuccess('Course added successfully'),
        error: () => this.handleError('Failed to add course'),
      });
    }
  }

  // --- Custom Dropdown Logic (Multi-Select) ---

  toggleStudentDropdown(): void {
    this.isStudentDropdownOpen = !this.isStudentDropdownOpen;
  }

  getSelectedStudentsLabel(): string {
    const currentIds = this.courseForm.get('studentIds')?.value || [];
    const count = currentIds.length;

    if (count === 0) {
      return 'Select Students...';
    } else if (count === this.students.length && this.students.length > 0) {
      return 'All Students Selected';
    } else if (count === 1) {
      const selectedId = currentIds[0];
      const student = this.students.find((s) => s.id === selectedId);
      return student ? student.name : '1 Student Selected';
    } else {
      return `${count} Students Selected`;
    }
  }

  isStudentSelected(studentId: number): boolean {
    const currentIds = this.courseForm.get('studentIds')?.value || [];
    return currentIds.includes(studentId);
  }

  isAllSelected(): boolean {
    const currentIds = this.courseForm.get('studentIds')?.value || [];
    return (
      this.students.length > 0 && currentIds.length === this.students.length
    );
  }

  onStudentChange(event: any): void {
    const studentId = +event.target.value;
    const isChecked = event.target.checked;
    const currentIds: number[] = this.courseForm.get('studentIds')?.value || [];

    if (isChecked) {
      if (!currentIds.includes(studentId)) {
        this.courseForm.patchValue({ studentIds: [...currentIds, studentId] });
      }
    } else {
      this.courseForm.patchValue({
        studentIds: currentIds.filter((id) => id !== studentId),
      });
    }
  }

  toggleAllStudents(event: any): void {
    if (event.target.checked) {
      const allIds = this.students.map((s) => s.id);
      this.courseForm.patchValue({ studentIds: allIds });
    } else {
      this.courseForm.patchValue({ studentIds: [] });
    }
  }

  // --- Helpers ---

  handleSuccess(msg: string) {
    this.loadCourses();
    this.successMessage = msg;
    this.cancelAddCourse();
    this.isLoading = false;
    setTimeout(() => (this.successMessage = ''), 4000);
  }

  handleError(msg: string) {
    this.errorMessage = msg;
    this.isLoading = false;
    setTimeout(() => (this.errorMessage = ''), 4000);
  }

  confirmDeleteCourse(course: Course): void {
    this.courseToDelete = course;
    this.showConfirmation = true;
  }

  onDeleteConfirmed(): void {
    if (!this.courseToDelete) return;

    this.adminService.deleteCourse(this.courseToDelete.id).subscribe({
      next: () => {
        this.loadCourses();
        this.successMessage = 'Course deleted successfully';
        this.showConfirmation = false;
        this.courseToDelete = null;
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: () => {
        this.errorMessage = 'Failed to delete course';
        this.showConfirmation = false;
      },
    });
  }

  onDeleteCancelled(): void {
    this.showConfirmation = false;
    this.courseToDelete = null;
  }

  private markFormGroupTouched(): void {
    Object.values(this.courseForm.controls).forEach((control) =>
      control.markAsTouched()
    );
  }

  get f() {
    return this.courseForm.controls;
  }
}
