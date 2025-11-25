import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-unlock-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unlock-requests.component.html',
})
export class UnlockRequestsComponent implements OnInit {
  requests: any[] = [];
  isLoading = true;

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.teacherService.getUnlockRequests().subscribe({
      next: (data) => {
        console.log('Unlock Requests:', data); // Debugging
        this.requests = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }
  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }
}
