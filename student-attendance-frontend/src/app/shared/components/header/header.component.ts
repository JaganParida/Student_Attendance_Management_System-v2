import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getStoredUser();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getDashboardRoute(): string {
    const role = this.currentUser?.role;
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'TEACHER':
        return '/teacher/dashboard';
      case 'STUDENT':
        return '/student/dashboard';
      default:
        return '/auth/login';
    }
  }

  getUserDisplayName(): string {
    return this.currentUser?.name || 'User';
  }

  getUserRoleDisplay(): string {
    const role = this.currentUser?.role;
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'TEACHER':
        return 'Teacher';
      case 'STUDENT':
        return 'Student';
      default:
        return 'User';
    }
  }
}
