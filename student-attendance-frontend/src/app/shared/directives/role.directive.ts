import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appRole]',
  standalone: true,
})
export class RoleDirective {
  private hasView = false;

  @Input() set appRole(roles: string | string[]) {
    const userRole = this.authService.getCurrentUserRole();
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    const hasRole = userRole && allowedRoles.includes(userRole);

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}
}
