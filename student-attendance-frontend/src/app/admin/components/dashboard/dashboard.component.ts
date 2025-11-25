import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardResponse } from '../../../core/models/api-response.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData: DashboardResponse | null = null;
  isLoading = true;
  errorMessage = '';

  // ✅ Subscription to manage the real-time polling
  private pollSubscription: Subscription | null = null;

  // Stats Card Configuration
  cardTitles = [
    'Total Teachers',
    'Total Students',
    'Total Classes',
    'Total Courses',
  ];
  cardIcons = [
    'fas fa-chalkboard-teacher',
    'fas fa-user-graduate',
    'fas fa-school',
    'fas fa-book',
  ];
  cardColors = ['primary', 'success', 'warning', 'info'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.startRealTimeUpdates();
  }

  // ✅ Correctly implementing OnDestroy to stop polling when leaving page
  ngOnDestroy(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  startRealTimeUpdates(): void {
    // ✅ REAL-TIME LOGIC: Fetches new data every 5 seconds (5000ms)
    this.pollSubscription = interval(5000)
      .pipe(
        startWith(0), // Trigger immediately (don't wait 5s for the first load)
        switchMap(() => this.adminService.getAdminDashboard()) // Switch to the API call
      )
      .subscribe({
        next: (data) => {
          // Updates the UI automatically whenever new data arrives
          console.log('Dashboard Data Updated:', data);
          this.dashboardData = data;
          this.isLoading = false;
        },
        error: (error) => {
          // If polling fails (e.g. server down), handle it gracefully
          this.errorMessage = 'Failed to load dashboard data';
          this.isLoading = false;
          console.error('Dashboard error:', error);
        },
      });
  }

  // Helper methods for template
  getCardValue(index: number): number {
    if (!this.dashboardData) return 0;
    switch (index) {
      case 0:
        return this.dashboardData.totalTeachers || 0;
      case 1:
        return this.dashboardData.totalStudents || 0;
      case 2:
        return this.dashboardData.totalClasses || 0;
      case 3:
        return this.dashboardData.totalCourses || 0;
      default:
        return 0;
    }
  }

  getCardTitle(index: number): string {
    return this.cardTitles[index];
  }

  getIcon(index: number): string {
    return this.cardIcons[index];
  }

  getCardColor(index: number): string {
    return this.cardColors[index];
  }

  // ✅ Helper to map Backend Status to Frontend CSS Colors
  getActivityColorClass(statusColor: string): string {
    switch (statusColor) {
      case 'success':
        return 'text-green-500'; // Attendance
      case 'primary':
        return 'text-blue-500'; // New User
      case 'warning':
        return 'text-orange-500'; // Pending Request
      case 'info':
        return 'text-purple-500'; // Approved Request
      default:
        return 'text-gray-500';
    }
  }
}
