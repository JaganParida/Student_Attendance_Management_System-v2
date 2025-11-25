import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
// ✅ Import the Under Construction Component
import { UnderConstructionComponent } from './shared/components/under-construction/under-construction.component';

const routes: Routes = [
  // 1. Landing Page (Root)
  { path: '', component: LandingPageComponent },

  // 2. Auth Routes
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },

  // 3. Admin Routes
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: 'ADMIN' },
  },

  // 4. Teacher Routes
  {
    path: 'teacher',
    loadChildren: () =>
      import('./teacher/teacher.module').then((m) => m.TeacherModule),
    canActivate: [AuthGuard],
    data: { role: 'TEACHER' },
  },

  // 5. Student Routes
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student.module').then((m) => m.StudentModule),
    canActivate: [AuthGuard],
    data: { role: 'STUDENT' },
  },

  // ✅ 6. Maintenance Page Route
  { path: 'maintenance', component: UnderConstructionComponent },

  // ✅ 7. Explicitly route "Attendance Details" to Maintenance (Temporary Fix)
  // You can add any other "Work In Progress" routes here
  { path: 'student/attendance-details', redirectTo: 'maintenance' },
  { path: 'teacher/reports', redirectTo: 'maintenance' },

  // ✅ 8. Catch-All: Redirect unknown paths to Maintenance instead of Landing Page
  { path: '**', redirectTo: 'maintenance' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
