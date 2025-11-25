import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'Student Attendance System';
  showHeader = false;
  showSidebar = false;
  isLoginPage = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage = event.urlAfterRedirects.includes('/auth/login');
        this.showHeader =
          this.authService.isAuthenticated() && !this.isLoginPage;
        this.showSidebar =
          this.authService.isAuthenticated() && !this.isLoginPage;
      });

    // Initial check
    this.showHeader = this.authService.isAuthenticated() && !this.isLoginPage;
    this.showSidebar = this.authService.isAuthenticated() && !this.isLoginPage;
  }
}
