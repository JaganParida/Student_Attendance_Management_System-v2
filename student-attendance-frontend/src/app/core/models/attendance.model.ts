// src/app/core/models/attendance.model.ts

// --- Used by Teacher ---
export interface AttendanceMarkRequest {
  courseId: number;
  date: string;
  sendEmailAlert: boolean;
  attendanceList: {
    studentId: number;
    status: string;
  }[];
}

export interface AttendanceResponse {
  studentId: number;
  studentName: string;
  rollNumber: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | null;
}

// --- ADD THIS FOR STUDENT MODULE ---
export interface AttendanceDetailResponse {
  id: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_LEAVE';
  courseName: string;
  courseCode: string;
  remarks?: string;
}
