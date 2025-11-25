import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AdminService } from '../../../core/services/admin.service';

export interface UnlockRequest {
  id: number;
  teacherName: string;
  teacherId: string;
  courseName: string;
  className: string;
  date: string;
  requestType: string;
  reason: string;
  status: string;
  requestedAt: string;
}

@Component({
  selector: 'app-unlock-requests',
  templateUrl: './unlock-requests.component.html',
  styleUrls: ['./unlock-requests.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    DatePipe,
  ],
})
export class UnlockRequestsComponent implements OnInit {
  requests: UnlockRequest[] = [];
  filteredRequests: UnlockRequest[] = [];
  isLoading = false;
  searchTerm = '';
  statusFilter = 'ALL';

  showConfirmation = false;
  currentAction: 'approve' | 'reject' | null = null;
  selectedRequest: UnlockRequest | null = null;

  statusOptions = [
    { value: 'ALL', label: 'All Requests' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUnlockRequests();
  }

  loadUnlockRequests(): void {
    this.isLoading = true;
    this.adminService.getAllUnlockRequests().subscribe({
      next: (data: any[]) => {
        this.requests = data.map((req) => this.mapBackendData(req));
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        this.isLoading = false;
      },
    });
  }

  private mapBackendData(req: any): UnlockRequest {
    return {
      id: req.id,
      teacherName:
        req.teacher?.name || req.course?.teacher?.name || 'Unknown Teacher',
      teacherId: req.teacher?.teacherId
        ? String(req.teacher.teacherId)
        : req.teacher?.id
        ? String(req.teacher.id)
        : '-',
      courseName: req.course?.courseName || 'Unknown Course',
      className:
        req.course?.classEntity?.className || req.classEntity?.className || '-',
      date:
        req.date ||
        req.attendanceDate ||
        req.requestDate ||
        new Date().toISOString(),
      requestType: req.requestType || 'MARK_ATTENDANCE',
      reason: req.reason || 'No reason provided',
      status: req.status || 'PENDING',
      requestedAt: req.createdAt || req.requestDate || new Date().toISOString(),
    };
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.requests];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          (request.teacherName &&
            request.teacherName.toLowerCase().includes(term)) ||
          (request.courseName &&
            request.courseName.toLowerCase().includes(term)) ||
          (request.className && request.className.toLowerCase().includes(term))
      );
    }

    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(
        (request) => request.status === this.statusFilter
      );
    }
    this.filteredRequests = filtered;
  }

  confirmAction(request: UnlockRequest, action: 'approve' | 'reject'): void {
    this.selectedRequest = request;
    this.currentAction = action;
    this.showConfirmation = true;
  }

  onActionConfirmed(): void {
    if (this.selectedRequest && this.currentAction) {
      this.isLoading = true;
      const isApprove = this.currentAction === 'approve';

      this.adminService
        .processUnlockRequest(this.selectedRequest.id, isApprove)
        .subscribe({
          next: (res) => {
            if (this.selectedRequest) {
              this.selectedRequest.status = isApprove ? 'APPROVED' : 'REJECTED';
            }
            this.loadUnlockRequests();
            this.resetActionState();
          },
          error: (err) => {
            console.error('Failed to process request', err);
            this.isLoading = false;
            this.resetActionState();
          },
        });
    }
  }

  onActionCancelled(): void {
    this.resetActionState();
  }

  private resetActionState(): void {
    this.showConfirmation = false;
    this.selectedRequest = null;
    this.currentAction = null;
  }

  getPendingCount(): number {
    return this.requests.filter((req) => req.status === 'PENDING').length;
  }
  getApprovedCount(): number {
    return this.requests.filter((req) => req.status === 'APPROVED').length;
  }
  getRejectedCount(): number {
    return this.requests.filter((req) => req.status === 'REJECTED').length;
  }

  getRequestTypeText(type: string): string {
    if (type === 'LATE_MARKING') return 'Mark Attendance';
    if (type === 'UPDATE_UNLOCK') return 'Edit Attendance';
    return type === 'MARK_ATTENDANCE' ? 'Mark Attendance' : 'Edit Attendance';
  }

  getRequestTypeIcon(type: string): string {
    return type === 'MARK_ATTENDANCE' || type === 'LATE_MARKING'
      ? 'fas fa-clipboard-check'
      : 'fas fa-edit';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'fas fa-clock';
      case 'APPROVED':
        return 'fas fa-check-circle';
      case 'REJECTED':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  }

  getConfirmationMessage(): string {
    if (!this.selectedRequest || !this.currentAction) return '';
    const action = this.currentAction === 'approve' ? 'approve' : 'reject';
    const type = this.getRequestTypeText(
      this.selectedRequest.requestType
    ).toLowerCase();
    return `Are you sure you want to ${action} ${this.selectedRequest.teacherName}'s request to ${type} for ${this.selectedRequest.courseName}?`;
  }
}
