import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { UserInfoResponse } from '../../../core/models/user.model';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;

  menuItems: MenuItem[] = [];
  currentUser: UserInfoResponse | null = null;
  private authSubscription: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to user changes to update menu dynamically
    this.authSubscription = this.authService.currentUser.subscribe(
      (user: UserInfoResponse | null) => {
        this.currentUser = user;
        // Fix: Ensure role exists before calling setMenuItems, default to empty string if null
        this.setMenuItems(user?.role || '');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  setMenuItems(role: string): void {
    if (!role) {
      this.menuItems = [];
      return;
    }

    switch (role.toUpperCase()) {
      case 'ADMIN':
        this.menuItems = this.getAdminMenuItems();
        break;
      case 'TEACHER':
        this.menuItems = this.getTeacherMenuItems();
        break;
      case 'STUDENT':
        this.menuItems = this.getStudentMenuItems();
        break;
      default:
        this.menuItems = [];
        break;
    }
  }

  private getAdminMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        route: '/admin/dashboard',
        active: true,
      },
      {
        label: 'Teachers',
        icon: 'fas fa-chalkboard-teacher',
        route: '/admin/teachers',
      },
      {
        label: 'Students',
        icon: 'fas fa-user-graduate',
        route: '/admin/students',
      },
      {
        label: 'Courses',
        icon: 'fas fa-book',
        route: '/admin/courses',
      },
      {
        label: 'Classes',
        icon: 'fas fa-users',
        route: '/admin/classes',
      },
      {
        label: 'Attendance Reports',
        icon: 'fas fa-clipboard-list',
        route: '/admin/attendance-reports',
      },
      {
        label: 'Unlock Requests',
        icon: 'fas fa-unlock',
        route: '/admin/unlock-requests',
      },
    ];
  }

  private getTeacherMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        route: '/teacher/dashboard',
        active: true,
      },
      {
        label: 'Mark Attendance',
        icon: 'fas fa-check-circle',
        route: '/teacher/mark-attendance',
      },
      {
        label: 'Edit Attendance',
        icon: 'fas fa-edit',
        route: '/teacher/edit-attendance',
      },
      {
        label: 'Student List',
        icon: 'fas fa-list',
        route: '/teacher/student-list',
      },
      {
        label: 'Attendance Performance',
        icon: 'fas fa-chart-line',
        route: '/teacher/attendance-performance',
      },
      {
        label: 'Unlock Requests',
        icon: 'fas fa-unlock',
        route: '/teacher/unlock-requests',
      },
    ];
  }

  private getStudentMenuItems(): MenuItem[] {
    return [
      {
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        route: '/student/dashboard',
        active: true,
      },
      {
        label: 'Attendance Details',
        icon: 'fas fa-calendar-check',
        route: '/student/attendance-details',
      },
      {
        label: 'Study Materials',
        icon: 'fas fa-book-open',
        route: '/student/study-materials',
      },
      {
        label: 'Leave Requests',
        icon: 'fas fa-envelope',
        route: '/student/leave-requests',
      },
    ];
  }

  toggleSubMenu(item: MenuItem): void {
    if (item.children) {
      item.active = !item.active;
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  // ✅ Added logout method to prevent template errors
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
