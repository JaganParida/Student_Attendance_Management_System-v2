import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
// Adjust this import path to match your project structure
import { AdminService } from '../../../core/services/admin.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

// Updated Interface to match Backend DTO
interface AttendanceReport {
  id?: number; // Optional as backend aggregation might not return a single ID
  className: string;
  courseName: string;
  teacherName: string;
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  status?: string; // Added status field from Backend
}

@Component({
  selector: 'app-attendance-reports',
  templateUrl: './attendance-reports.component.html',
  styleUrls: ['./attendance-reports.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    DateFormatPipe,
  ],
})
export class AttendanceReportsComponent implements OnInit {
  reports: AttendanceReport[] = [];
  filteredReports: AttendanceReport[] = [];
  isLoading = false;
  isGeneratingReport = false;

  filterForm: FormGroup;

  // Filters are now dynamic
  classes: string[] = ['All'];
  courses: string[] = ['All'];
  dateRanges = ['All Time', 'Today', 'Last 7 days', 'Last 30 days'];

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService // ✅ Inject AdminService
  ) {
    this.filterForm = this.formBuilder.group({
      class: ['All'],
      course: ['All'],
      dateRange: ['All Time'],
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.loadReports();
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadReports(): void {
    this.isLoading = true;

    // ✅ Real API Call
    this.adminService.getAttendanceReports().subscribe({
      next: (data: any[]) => {
        this.reports = data;
        this.filteredReports = data;

        // Extract unique classes and courses for the filter dropdowns
        this.extractFilterOptions();

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching attendance reports:', error);
        this.isLoading = false;
      },
    });
  }

  // ✅ Helper to make filters dynamic based on DB data
  extractFilterOptions(): void {
    const classSet = new Set<string>(this.reports.map((r) => r.className));
    const courseSet = new Set<string>(this.reports.map((r) => r.courseName));

    this.classes = ['All', ...Array.from(classSet)];
    this.courses = ['All', ...Array.from(courseSet)];
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    let filtered = [...this.reports];

    // Filter by Class
    if (filters.class !== 'All') {
      filtered = filtered.filter(
        (report) => report.className === filters.class
      );
    }

    // Filter by Course
    if (filters.course !== 'All') {
      filtered = filtered.filter(
        (report) => report.courseName === filters.course
      );
    }

    // Filter by Date Logic
    if (filters.dateRange !== 'All Time') {
      const today = new Date();
      const reportDate = new Date(); // placeholder

      filtered = filtered.filter((report) => {
        const rDate = new Date(report.date);

        if (filters.dateRange === 'Today') {
          return rDate.toDateString() === today.toDateString();
        }
        if (filters.dateRange === 'Last 7 days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);
          return rDate >= sevenDaysAgo;
        }
        if (filters.dateRange === 'Last 30 days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return rDate >= thirtyDaysAgo;
        }
        return true;
      });
    }

    this.filteredReports = filtered;
  }

  generateReport(): void {
    this.isGeneratingReport = true;
    // Simulate report generation delay
    setTimeout(() => {
      this.isGeneratingReport = false;
      this.downloadReport();
    }, 2000);
  }

  downloadReport(): void {
    // Prepare data for export (e.g., Console log or eventual CSV export)
    const data = this.filteredReports.map((report) => ({
      Class: report.className,
      Course: report.courseName,
      Teacher: report.teacherName,
      Date: report.date,
      'Total Students': report.totalStudents,
      Present: report.presentCount,
      Absent: report.absentCount,
      'Attendance %': report.attendancePercentage + '%',
      Status: report.status || this.getStatusText(report.attendancePercentage),
    }));

    console.log('Generated report data:', data);
    alert('Report generated successfully! Data logged to console.');
  }

  getUniqueClasses(): string[] {
    return [...new Set(this.filteredReports.map((report) => report.className))];
  }

  getAverageAttendance(): number {
    if (this.filteredReports.length === 0) return 0;
    const totalPercentage = this.filteredReports.reduce(
      (sum, report) => sum + report.attendancePercentage,
      0
    );
    return (
      Math.round((totalPercentage / this.filteredReports.length) * 10) / 10
    );
  }

  getTotalStudents(): number {
    return this.filteredReports.reduce(
      (total, report) => total + report.totalStudents,
      0
    );
  }

  getAttendanceColor(percentage: number): string {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'danger';
  }

  getAttendanceIcon(percentage: number): string {
    if (percentage >= 90) return 'fas fa-check-circle';
    if (percentage >= 75) return 'fas fa-exclamation-circle';
    return 'fas fa-times-circle';
  }

  // Updated to prioritize Backend status if available
  getStatusText(percentage: number): string {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    return 'Needs Attention';
  }
}
