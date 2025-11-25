import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, format: string = 'medium'): string {
    if (!value) return '';

    const date = new Date(value);

    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'medium':
        return (
          date.toLocaleDateString() +
          ' ' +
          date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      case 'long':
        return date.toLocaleString();
      case 'time':
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'relative':
        return this.getRelativeTimeString(date);
      default:
        return date.toLocaleDateString();
    }
  }

  private getRelativeTimeString(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  }
}
