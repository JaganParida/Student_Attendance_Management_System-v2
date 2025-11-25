import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TeacherRoutingModule } from './teacher-routing.module';

// Import All Standalone Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MarkAttendanceComponent } from './components/mark-attendance/mark-attendance.component';
import { EditAttendanceComponent } from './components/edit-attendance/edit-attendance.component';
import { UnlockRequestsComponent } from './components/unlock-requests/unlock-requests.component';

@NgModule({
  declarations: [
    // declarations array should be empty if all components are standalone
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    // ✅ All Standalone Components go here (Imported, NOT Declared)
    DashboardComponent,
    MarkAttendanceComponent,
    EditAttendanceComponent,
    UnlockRequestsComponent,
  ],
})
export class TeacherModule {}
