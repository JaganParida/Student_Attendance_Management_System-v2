import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

interface LeaveRequest {
  id: number;
  courseName: string;
  courseCode: string;
  fromDate: string;
  toDate: string;
  reason: string;
  proofDocument?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
  remarks?: string;
}

@Component({
  selector: 'app-leave-requests',
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    ConfirmationDialogComponent,
    DateFormatPipe,
  ],
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  leaveForm: FormGroup;
  showLeaveForm = false;
  showConfirmation = false;
  requestToDelete: LeaveRequest | null = null;

  // Mock courses for demo
  courses = [
    { id: 1, name: 'Mathematics', code: 'MATH101' },
    { id: 2, name: 'Physics', code: 'PHY101' },
    { id: 3, name: 'Chemistry', code: 'CHEM101' },
    { id: 4, name: 'Biology', code: 'BIO101' },
  ];

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder
  ) {
    this.leaveForm = this.formBuilder.group({
      courseId: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      proofDocument: [''],
    });
  }

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    this.isLoading = true;
    // Mock data - in real app, fetch from service
    setTimeout(() => {
      this.leaveRequests = [
        {
          id: 1,
          courseName: 'Mathematics',
          courseCode: 'MATH101',
          fromDate: '2024-01-22',
          toDate: '2024-01-23',
          reason: 'Family emergency requiring immediate attention',
          status: 'PENDING',
          requestedAt: '2024-01-20T10:30:00',
        },
        {
          id: 2,
          courseName: 'Physics',
          courseCode: 'PHY101',
          fromDate: '2024-01-18',
          toDate: '2024-01-18',
          reason: 'Medical appointment for regular checkup',
          proofDocument: 'medical_certificate.pdf',
          status: 'APPROVED',
          requestedAt: '2024-01-17T14:20:00',
          processedAt: '2024-01-18T09:15:00',
          processedBy: 'Dr. Smith',
          remarks: 'Approved with medical proof',
        },
        {
          id: 3,
          courseName: 'Chemistry',
          courseCode: 'CHEM101',
          fromDate: '2024-01-15',
          toDate: '2024-01-16',
          reason: 'Personal reasons requiring time off',
          status: 'REJECTED',
          requestedAt: '2024-01-14T16:45:00',
          processedAt: '2024-01-15T11:30:00',
          processedBy: 'Ms. Davis',
          remarks: 'Insufficient reason provided for two-day leave',
        },
      ];
      this.isLoading = false;
    }, 1000);
  }

  openLeaveForm(): void {
    this.showLeaveForm = true;
    this.leaveForm.reset();
  }

  closeLeaveForm(): void {
    this.showLeaveForm = false;
    this.leaveForm.reset();
  }

  onSubmitLeave(): void {
    if (this.leaveForm.valid) {
      this.isSubmitting = true;
      const formData = this.leaveForm.value;
      const course = this.courses.find((c) => c.id === +formData.courseId);

      const newRequest: LeaveRequest = {
        id: this.leaveRequests.length + 1,
        courseName: course?.name || '',
        courseCode: course?.code || '',
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        reason: formData.reason,
        proofDocument: formData.proofDocument,
        status: 'PENDING',
        requestedAt: new Date().toISOString(),
      };

      // In real app, this would call the service
      this.leaveRequests.unshift(newRequest);
      this.isSubmitting = false;
      this.showLeaveForm = false;
      this.successMessage = 'Leave request submitted successfully';
      this.clearMessagesAfterDelay();
    } else {
      this.markFormGroupTouched();
    }
  }

  confirmDeleteRequest(request: LeaveRequest): void {
    this.requestToDelete = request;
    this.showConfirmation = true;
  }

  onDeleteConfirmed(): void {
    if (this.requestToDelete) {
      this.leaveRequests = this.leaveRequests.filter(
        (req) => req.id !== this.requestToDelete!.id
      );
      this.showConfirmation = false;
      this.requestToDelete = null;
      this.successMessage = 'Leave request deleted successfully';
      this.clearMessagesAfterDelay();
    }
  }

  onDeleteCancelled(): void {
    this.showConfirmation = false;
    this.requestToDelete = null;
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

  getTotalDays(fromDate: string, toDate: string): number {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  canDeleteRequest(request: LeaveRequest): boolean {
    return request.status === 'PENDING';
  }

  getPendingRequests(): LeaveRequest[] {
    return this.leaveRequests.filter((req) => req.status === 'PENDING');
  }

  getProcessedRequests(): LeaveRequest[] {
    return this.leaveRequests.filter((req) => req.status !== 'PENDING');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.leaveForm.controls).forEach((key) => {
      this.leaveForm.get(key)?.markAsTouched();
    });
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 5000);
  }

  get courseId() {
    return this.leaveForm.get('courseId');
  }
  get fromDate() {
    return this.leaveForm.get('fromDate');
  }
  get toDate() {
    return this.leaveForm.get('toDate');
  }
  get reason() {
    return this.leaveForm.get('reason');
  }
}
