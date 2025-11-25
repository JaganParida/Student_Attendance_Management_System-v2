import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message: string = 'Loading...';
  @Input() overlay: boolean = false;

  get spinnerSize(): string {
    switch (this.size) {
      case 'sm':
        return '16px';
      case 'md':
        return '24px';
      case 'lg':
        return '32px';
      default:
        return '24px';
    }
  }

  get borderSize(): string {
    switch (this.size) {
      case 'sm':
        return '2px';
      case 'md':
        return '3px';
      case 'lg':
        return '4px';
      default:
        return '3px';
    }
  }
}
