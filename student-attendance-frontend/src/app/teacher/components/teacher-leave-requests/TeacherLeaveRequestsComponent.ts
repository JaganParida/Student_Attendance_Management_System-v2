import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

// ✅ CORRECT INTERFACE: Matches Java 'LeaveRequestResponse' Flat DTO
interface TeacherLeaveRequest {
  id: number;
  studentName: string;
  rollNumber: string;
  courseName: string;
  courseCode: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string; // Optional field for history
}

@Component({
  selector: 'app-teacher-leave-requests',
  templateUrl: './teacher-leave-requests.component.html',
  styleUrls: ['./teacher-leave-requests.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, DateFormatPipe],
})
export class TeacherLeaveRequestsComponent implements OnInit {
  pendingRequests: TeacherLeaveRequest[] = [];
  historyRequests: TeacherLeaveRequest[] = [];

  activeTab: 'pending' | 'history' = 'pending';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  switchTab(tab: 'pending' | 'history') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    if (tab === 'pending') {
      this.loadPendingRequests();
    } else {
      this.loadHistoryRequests();
    }
  }

  loadPendingRequests() {
    this.isLoading = true;
    this.teacherService.getPendingLeaveRequests().subscribe({
      next: (data: any[]) => {
        this.pendingRequests = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load pending requests.';
      },
    });
  }

  loadHistoryRequests() {
    this.isLoading = true;
    this.teacherService.getProcessedLeaveRequests().subscribe({
      next: (data: any[]) => {
        this.historyRequests = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load history.';
      },
    });
  }

  processRequest(id: number, approve: boolean) {
    if (!confirm(approve ? 'Approve this request?' : 'Reject this request?'))
      return;

    this.isLoading = true;
    this.teacherService.processLeaveRequest(id, approve).subscribe({
      next: () => {
        this.successMessage = approve ? 'Request Approved' : 'Request Rejected';
        this.loadPendingRequests(); // Refresh the list
        this.isLoading = false;
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Action failed. Please try again.';
        setTimeout(() => (this.errorMessage = ''), 3000);
      },
    });
  }
}
