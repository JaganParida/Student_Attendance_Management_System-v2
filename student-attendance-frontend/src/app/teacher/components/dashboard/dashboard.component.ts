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
  todayClasses: TodayClass[] = [];
  isLoading = true;
  currentDate = new Date();
  greeting = '';

  totalStudents = 0;
  totalCourses = 0;
  pendingRequests = 0;
  attendanceMarkedToday = 0;

  constructor(private teacherService: TeacherService, private router: Router) {
    this.setGreeting();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private getLocalDateString(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  }

  loadDashboardData() {
    this.isLoading = true;
    this.teacherService.getTeacherDashboard().subscribe({
      next: (data) => {
        this.totalStudents = data.totalStudents || 0;
        this.totalCourses = data.totalCourses || 0;
        this.pendingRequests = data.pendingUnlockRequests || 0;
        this.attendanceMarkedToday = data.attendanceMarkedToday || 0;
        this.todayClasses = data.todayClasses || [];
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

  handleClassAction(
    courseId: number,
    startTime: string,
    status: string,
    isMarked: boolean | undefined
  ) {
    const today = this.getLocalDateString();

    if (status === 'Unlocked') {
      this.router.navigate(['/teacher/mark-attendance'], {
        queryParams: { courseId, startTime, mode: 'edit', date: today },
      });
    } else if (status === 'Ongoing') {
      if (isMarked) {
        this.router.navigate(['/teacher/mark-attendance'], {
          queryParams: { courseId, startTime, mode: 'edit', date: today },
        });
      } else {
        this.router.navigate(['/teacher/mark-attendance'], {
          queryParams: { courseId, startTime, date: today },
        });
      }
    } else if (status === 'Expired' || status === 'Locked') {
      this.requestUnlock(courseId);
    } else if (status === 'Completed') {
      this.router.navigate(['/teacher/mark-attendance'], {
        queryParams: { courseId, startTime, mode: 'edit', date: today },
      });
    } else if (status === 'Upcoming') {
      alert('Class has not started yet.');
    } else if (status === 'NotAllowed') {
      alert(
        '⚠️ Request period expired. Requests are only allowed within 2 days.'
      );
    }
  }

  requestUnlock(courseId: number) {
    const reason = prompt('⚠️ Time Expired. Enter reason for unlock:');
    if (reason) {
      const payload = {
        courseId: courseId,
        date: this.getLocalDateString(),
        reason: reason,
        requestType: 'LATE_MARKING',
      };
      this.teacherService.createUnlockRequest(payload).subscribe({
        next: () => {
          alert('✅ Request Sent! Please wait for admin approval.');
          this.loadDashboardData();
        },
        error: (err) => alert('❌ Failed to send request.'),
      });
    }
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      Ongoing: 'status-ongoing',
      Expired: 'status-locked',
      Locked: 'status-locked',
      NotAllowed: 'status-locked', // Red
      Unlocked: 'status-unlocked',
      Pending: 'status-warning',
      Upcoming: 'status-upcoming',
      Completed: 'status-completed',
    };
    return statusMap[status] || 'status-upcoming';
  }

  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      Ongoing: 'fas fa-play-circle',
      Expired: 'fas fa-ban',
      Locked: 'fas fa-lock',
      NotAllowed: 'fas fa-times-circle',
      Unlocked: 'fas fa-unlock',
      Pending: 'fas fa-hourglass-half',
      Upcoming: 'fas fa-clock',
      Completed: 'fas fa-check-circle',
    };
    return iconMap[status] || 'fas fa-clock';
  }

  getStatusText(status: string): string {
    return status;
  }
}
