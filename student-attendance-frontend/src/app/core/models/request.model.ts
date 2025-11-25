// src/app/core/models/request.model.ts

export interface UnlockRequest {
  id?: number; // Optional because it's not present when creating a new request
  courseId: number;
  date: string; // Format: YYYY-MM-DD
  reason: string;
  requestType: 'LATE_MARKING' | 'ATTENDANCE_CORRECTION';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

export interface LeaveRequest {
  id: number;
  studentId: number;
  studentName?: string; // Optional if backend sends it
  date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
