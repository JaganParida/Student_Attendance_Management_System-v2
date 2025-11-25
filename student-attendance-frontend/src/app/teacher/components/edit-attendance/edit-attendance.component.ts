import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-edit-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-attendance.component.html',
})
export class EditAttendanceComponent implements OnInit {
  courses: any[] = [];
  selectedCourseId: number | null = null;
  editDate: string = '';
  maxDate = new Date().toISOString().split('T')[0];
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.isLoading = true;
    this.teacherService.getTeacherCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      },
    });
  }

  proceed() {
    if (this.selectedCourseId && this.editDate) {
      this.isSubmitting = true;

      // Simulate API call delay for better UX
      setTimeout(() => {
        // ✅ FIX: Passing mode: 'edit' ensures the next page loads in Update Mode
        this.router.navigate(['/teacher/mark-attendance'], {
          queryParams: {
            courseId: this.selectedCourseId,
            date: this.editDate,
            mode: 'edit',
          },
        });

        // Reset loading state after navigation
        this.isSubmitting = false;
      }, 500);
    }
  }
}
