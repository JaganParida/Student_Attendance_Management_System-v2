import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';

interface CourseAttendance {
  courseId: number;
  courseName: string;
  courseCode: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

interface StudentDashboardData {
  studentName: string;
  rollNumber: string;
  semester: string;
  academicYear: string;
  overallAttendance: number;
  courseAttendances: CourseAttendance[];
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class StudentDashboardComponent implements OnInit {
  dashboardData: StudentDashboardData | null = null;
  isLoading = true;
  errorMessage = '';

  // Filter Options
  years = ['2023-2024', '2024-2025', '2025-2026'];
  semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

  // Selected Filter Models - Initialize as null or default to let API decide first
  selectedYear: string = 'All';
  selectedSemester: string = 'All';

  // Track if it's the initial load to prevent overwriting user selection later
  isFirstLoad = true;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    // First load: Send 'All' (or empty) to get current status from backend default
    this.loadDashboard();
  }

  loadDashboard() {
    this.isLoading = true;
    this.errorMessage = '';

    // Pass the selected filters to the service
    // On first load, these are 'All', so backend will use student's current class
    this.studentService
      .getStudentDashboard(this.selectedYear, this.selectedSemester)
      .subscribe({
        next: (data: StudentDashboardData) => {
          console.log('Student Dashboard Data:', data);
          this.dashboardData = data;

          // ✅ FIX: Auto-select current Academic Year & Semester on first load
          if (this.isFirstLoad && data) {
            if (data.academicYear && data.academicYear !== 'N/A') {
              // Ensure the year from backend exists in our dropdown list, else add it
              if (!this.years.includes(data.academicYear)) {
                this.years.push(data.academicYear);
              }
              this.selectedYear = data.academicYear;
            }

            if (data.semester && data.semester !== 'N/A') {
              // Extract number from "Semester 5" or "5" to match dropdown values "1", "2"...
              const semNum = data.semester.replace(/\D/g, '');
              if (this.semesters.includes(semNum)) {
                this.selectedSemester = semNum;
              }
            }
            this.isFirstLoad = false;
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Dashboard Load Error:', err);
          this.errorMessage =
            'Failed to load data. Please check your connection.';
          this.isLoading = false;
        },
      });
  }

  onSearch() {
    // Manual search: We keep isFirstLoad false so we don't override user choice
    this.isFirstLoad = false;
    this.loadDashboard();
  }

  resetFilters() {
    this.selectedYear = 'All';
    this.selectedSemester = 'All';
    this.isFirstLoad = true; // Allow auto-select again
    this.loadDashboard();
  }

  // --- UI Helpers ---

  getColor(percentage: number): string {
    if (percentage >= 75) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }

  getAttendanceBadgeClass(percentage: number): string {
    if (percentage >= 75) return 'badge-high';
    if (percentage >= 60) return 'badge-medium';
    return 'badge-low';
  }

  getCoursesAbove(threshold: number): number {
    if (!this.dashboardData?.courseAttendances) return 0;
    return this.dashboardData.courseAttendances.filter(
      (c) => c.percentage >= threshold
    ).length;
  }

  getCoursesBelow(threshold: number): number {
    if (!this.dashboardData?.courseAttendances) return 0;
    return this.dashboardData.courseAttendances.filter(
      (c) => c.percentage < threshold
    ).length;
  }
}
