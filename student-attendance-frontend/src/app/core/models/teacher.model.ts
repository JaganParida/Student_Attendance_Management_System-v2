export interface TodayClass {
  id: number; // Course ID
  courseName: string;
  courseCode: string;
  startTime: string; // "10:00:00"
  endTime: string;
  classRoom: string;
  className: string; // "Sem 5"
  section: string; // "A"
  status: string; // "Ongoing", "Expired", "Unlocked", "NotAllowed"

  // 🔴 REQUIRED FIELDS
  isUnlockedByAdmin?: boolean;
  isAttendanceMarked?: boolean;
  hasPendingRequest?: boolean;
}

export interface TeacherDashboardResponse {
  totalCourses: number;
  totalStudents: number;
  attendanceMarkedToday: number;
  pendingUnlockRequests: number;
  pendingLeaveRequests: number;
  todayClasses: TodayClass[];
}
