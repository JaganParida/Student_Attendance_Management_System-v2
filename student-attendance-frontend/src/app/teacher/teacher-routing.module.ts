import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MarkAttendanceComponent } from './components/mark-attendance/mark-attendance.component';
import { EditAttendanceComponent } from './components/edit-attendance/edit-attendance.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { UnlockRequestsComponent } from './components/unlock-requests/unlock-requests.component';
import { AttendancePerformanceComponent } from './components/attendance-performance/attendance-performance.component';
// ✅ FIX: File is directly in 'components', so we remove the extra folder from the path
import { TeacherLeaveRequestsComponent } from './components/teacher-leave-requests/TeacherLeaveRequestsComponent';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mark-attendance', component: MarkAttendanceComponent },
  { path: 'edit-attendance', component: EditAttendanceComponent },
  { path: 'student-list', component: StudentListComponent },
  { path: 'unlock-requests', component: UnlockRequestsComponent },
  { path: 'performance', component: AttendancePerformanceComponent },
  // ✅ FIX: Added Route
  { path: 'leave-requests', component: TeacherLeaveRequestsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
