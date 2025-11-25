import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// ✅ FIX: Import the correct class name
import { StudentDashboardComponent } from './components/dashboard/dashboard.component';
import { AttendanceDetailsComponent } from './components/attendance-details/attendance-details.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
