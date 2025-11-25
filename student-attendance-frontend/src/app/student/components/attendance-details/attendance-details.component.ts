import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';

export interface AttendanceRecord {
  id: number;
  date: string;
  status: string; // 'PRESENT', 'ABSENT', 'LATE'
  courseName: string;
  courseCode: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-attendance-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-details.component.html',
})
export class AttendanceDetailsComponent implements OnInit {
  // Data Sources
  allRecords: AttendanceRecord[] = [];
  filteredRecords: AttendanceRecord[] = [];

  // UI State
  isLoading = true;
  errorMessage = '';

  // Filters
  searchText = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private studentService: StudentService) {
    // Set default date range (Last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    this.endDate = end.toISOString().split('T')[0];
    this.startDate = start.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance() {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService
      .getStudentAttendance(undefined, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.allRecords = data;
          this.applyFilter(); // Apply local search filter
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Attendance Load Error:', err);
          this.errorMessage = 'Failed to load attendance records.';
          this.isLoading = false;
        },
      });
  }

  onDateChange() {
    // Reload from server when date range changes
    this.loadAttendance();
  }

  applyFilter() {
    const term = this.searchText.toLowerCase().trim();

    if (!term) {
      this.filteredRecords = [...this.allRecords];
      return;
    }

    this.filteredRecords = this.allRecords.filter(
      (record) =>
        record.courseName.toLowerCase().includes(term) ||
        record.courseCode.toLowerCase().includes(term) ||
        record.status.toLowerCase().includes(term) ||
        record.date.includes(term)
    );
  }

  // --- UI Helpers ---
  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return 'bg-success-subtle text-success border-success';
      case 'ABSENT':
        return 'bg-danger-subtle text-danger border-danger';
      case 'LATE':
        return 'bg-warning-subtle text-warning border-warning';
      default:
        return 'bg-light text-dark border-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PRESENT':
        return 'fas fa-check-circle';
      case 'ABSENT':
        return 'fas fa-times-circle';
      case 'LATE':
        return 'fas fa-clock';
      default:
        return 'fas fa-question-circle';
    }
  }
}
