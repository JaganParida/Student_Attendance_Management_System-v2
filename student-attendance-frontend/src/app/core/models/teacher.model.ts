export interface TodayClass {
  id: number; // Course ID
  courseName: string;
  courseCode: string;
  startTime: string; // "10:00:00"
  endTime: string;
  classRoom: string;
  className: string; // "Sem 5"
  section: string; // "A"
  status: string; // "Upcoming", "Ongoing", "Completed", "Locked"

  // 🔴 NEW FIELD: Required for UI to show "Edit (Approved)"
  isUnlockedByAdmin?: boolean;
}

export interface TeacherDashboardResponse {
  totalCourses: number;
  totalStudents: number;
  attendanceMarkedToday: number;
  pendingUnlockRequests: number;
  pendingLeaveRequests: number;
  todayClasses: TodayClass[];
}
