import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ConfirmationDialogComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() type: 'danger' | 'warning' | 'info' = 'info';
  @Input() show: boolean = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.show = false;
  }

  onCancel(): void {
    this.cancelled.emit();
    this.show = false;
  }

  getIconClass(): string {
    switch (this.type) {
      case 'danger':
        return 'fas fa-exclamation-triangle text-red-500';
      case 'warning':
        return 'fas fa-exclamation-circle text-yellow-500';
      case 'info':
        return 'fas fa-info-circle text-blue-500';
      default:
        return 'fas fa-info-circle text-blue-500';
    }
  }

  getConfirmButtonClass(): string {
    switch (this.type) {
      case 'danger':
        return 'btn-danger';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-primary';
      default:
        return 'btn-primary';
    }
  }
}
