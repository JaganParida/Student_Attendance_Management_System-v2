import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getCurrentUserRole();
      const expectedRole = route.data['role'];

      if (expectedRole && userRole !== expectedRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
