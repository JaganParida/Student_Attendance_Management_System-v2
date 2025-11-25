import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TeacherRoutingModule } from './teacher-routing.module';

// --- Import All Standalone Components ---
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MarkAttendanceComponent } from './components/mark-attendance/mark-attendance.component';
import { EditAttendanceComponent } from './components/edit-attendance/edit-attendance.component';
import { UnlockRequestsComponent } from './components/unlock-requests/unlock-requests.component';
// 🔴 FIX: Components previously missing from the imports array:
import { StudentListComponent } from './components/student-list/student-list.component';
import { AttendancePerformanceComponent } from './components/attendance-performance/attendance-performance.component';
import { TeacherLeaveRequestsComponent } from './components/teacher-leave-requests/TeacherLeaveRequestsComponent';

@NgModule({
  declarations: [
    // Declarations array is empty as all components are standalone
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    ReactiveFormsModule, // ✅ All Standalone Components must be imported here

    DashboardComponent,
    MarkAttendanceComponent,
    EditAttendanceComponent,
    UnlockRequestsComponent,

    // Components required for your defined routes:
    StudentListComponent,
    AttendancePerformanceComponent,
    TeacherLeaveRequestsComponent, // <--- Final fix applied here
  ],
})
export class TeacherModule {}
