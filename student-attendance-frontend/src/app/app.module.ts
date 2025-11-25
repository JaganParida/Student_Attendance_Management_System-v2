import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router'; // Ensure RouterModule is available if needed globally

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

// 1. FIX: Use the actual exported class names for all imports
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LoginComponent } from './auth/components/login/login.component';

// --- ADMIN IMPORTS ---
import { DashboardComponent as AdminDashboardComponent } from './admin/components/dashboard/dashboard.component';
import { TeachersComponent } from './admin/components/teachers/teachers.component';
import { StudentsComponent } from './admin/components/students/students.component';
import { CoursesComponent } from './admin/components/courses/courses.component';
import { ClassesComponent } from './admin/components/classes/classes.component';
import { AttendanceReportsComponent } from './admin/components/attendance-reports/attendance-reports.component';
import { UnlockRequestsComponent } from './admin/components/unlock-requests/unlock-requests.component';

// --- TEACHER IMPORTS ---
import { DashboardComponent as TeacherDashboardComponent } from './teacher/components/dashboard/dashboard.component';
import { MarkAttendanceComponent } from './teacher/components/mark-attendance/mark-attendance.component';
import { EditAttendanceComponent } from './teacher/components/edit-attendance/edit-attendance.component';

// --- STUDENT IMPORTS (Crucial Fix) ---
// The actual component export name is likely StudentDashboardComponent, not DashboardComponent
import { StudentDashboardComponent } from './student/components/dashboard/dashboard.component';
import { AttendanceDetailsComponent } from './student/components/attendance-details/attendance-details.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // Ensure RouterModule is here if router-outlet or routerLink is used in AppComponent
    RouterModule,

    // 2. FIX: List all Standalone components with their correct names
    HeaderComponent,
    SidebarComponent,
    LoginComponent,

    // Admin
    AdminDashboardComponent,
    TeachersComponent,
    StudentsComponent,
    CoursesComponent,
    ClassesComponent,
    AttendanceReportsComponent,
    UnlockRequestsComponent,

    // Teacher
    TeacherDashboardComponent,
    MarkAttendanceComponent,
    EditAttendanceComponent,

    // Student (Fixes the "export was not found" error)
    StudentDashboardComponent,
    AttendanceDetailsComponent,
  ],
  providers: [
    // Interceptors are correctly placed here
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
