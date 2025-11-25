import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './components/dashboard/dashboard.component';
import { AttendanceDetailsComponent } from './components/attendance-details/attendance-details.component';
// ✅ FIX: Import the new LeaveRequestsComponent
import { LeaveRequestsComponent } from './components/leave-requests/leave-requests.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent,
  },
  {
    path: 'attendance-details',
    component: AttendanceDetailsComponent,
  },
  // ✅ ADDED: Route for Leave Requests
  {
    path: 'leave-requests',
    component: LeaveRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
