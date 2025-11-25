import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TeacherService } from '../../../core/services/teacher.service';
import { TodayClass } from '../../../core/models/teacher.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Stats
  totalStudents = 0;
  totalCourses = 0;
  pendingRequests = 0;
  attendanceMarkedToday = 0; // Schedule Data

  todayClasses: TodayClass[] = []; // UI State

  isLoading = true;
  currentDate = new Date();
  greeting = '';

  constructor(private teacherService: TeacherService, private router: Router) {
    this.setGreeting();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.teacherService.getTeacherDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard Data:', data);
        this.totalStudents = data.totalStudents || 0;
        this.totalCourses = data.totalCourses || 0;
        this.pendingRequests = data.pendingUnlockRequests || 0;
        this.attendanceMarkedToday = data.attendanceMarkedToday || 0; // 🔴 FIX: Map backend flags to UI Statuses (Unlocked, Pending)

        this.todayClasses = (data.todayClasses || []).map((c: any) => {
          let uiStatus = c.status;

          // Priority 1: If Admin Approved -> Unlocked
          if (c.isUnlockedByAdmin) {
            uiStatus = 'Unlocked';
          }
          // Priority 2: If Request Pending -> Pending
          else if (c.hasPendingRequest) {
            uiStatus = 'Pending';
          }

          return { ...c, status: uiStatus };
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.isLoading = false;
      },
    });
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good Morning';
    else if (hour < 18) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  handleClassAction(courseId: number, startTime: string, status: string) {
    // ✅ Fix: Redirect 'Unlocked' status to Edit Page
    if (status === 'Completed' || status === 'Unlocked') {
      this.router.navigate(['/teacher/mark-attendance'], {
        queryParams: { courseId, startTime, mode: 'edit' },
      });
    } else {
      this.router.navigate(['/teacher/mark-attendance'], {
        queryParams: { courseId, startTime },
      });
    }
  }

  requestUnlock(courseId: number) {
    const reason = prompt(
      '⚠️ Late Attendance Detected.\n\nPlease enter a reason to request access (e.g. "Network Issue"):'
    );

    if (reason) {
      const payload = {
        courseId: courseId,
        date: new Date().toISOString().split('T')[0],
        reason: reason,
        requestType: 'LATE_MARKING',
      };

      this.teacherService.createUnlockRequest(payload).subscribe({
        next: () => {
          console.log('✅ Request Sent!');
          this.loadDashboardData();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      Completed: 'status-completed',
      Ongoing: 'status-ongoing',
      Upcoming: 'status-upcoming',
      Locked: 'status-locked',
      Expired: 'status-locked',
      Unlocked: 'status-unlocked',
      Pending: 'status-warning', // Yellow/Orange for Pending
    };
    return statusMap[status] || 'status-upcoming';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      Completed: 'fas fa-check-circle',
      Ongoing: 'fas fa-play-circle',
      Upcoming: 'fas fa-clock',
      Locked: 'fas fa-lock',
      Expired: 'fas fa-ban',
      Unlocked: 'fas fa-unlock',
      Pending: 'fas fa-hourglass-half',
    };
    return iconMap[status] || 'fas fa-clock';
  }

  getStatusText(status: string): string {
    const textMap: { [key: string]: string } = {
      Completed: 'Completed',
      Ongoing: 'Ongoing',
      Upcoming: 'Upcoming',
      Locked: 'Time Expired',
      Expired: 'Time Expired',
      Unlocked: 'Unlocked',
      Pending: 'Time Requested', // Shows Pending text
    };
    return textMap[status] || status;
  }
}
