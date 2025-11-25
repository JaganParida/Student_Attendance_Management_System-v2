import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Standalone Components, Directives, and Pipes
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { RoleDirective } from './directives/role.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';

// Export standalone components for easy importing
export { HeaderComponent } from './components/header/header.component';
export { SidebarComponent } from './components/sidebar/sidebar.component';
export { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
export { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
export { RoleDirective } from './directives/role.directive';
export { ClickOutsideDirective } from './directives/click-outside.directive';
export { FilterPipe } from './pipes/filter.pipe';
export { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    // Import standalone components
    HeaderComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,

    // Import standalone directives and pipes
    RoleDirective,
    ClickOutsideDirective,
    FilterPipe,
    DateFormatPipe,
  ],
  exports: [
    // Common Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // Standalone Components
    HeaderComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,

    // Standalone Directives and Pipes
    RoleDirective,
    ClickOutsideDirective,
    FilterPipe,
    DateFormatPipe,
  ],
})
export class SharedModule {}
