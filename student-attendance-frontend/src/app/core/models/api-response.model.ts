export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// ✅ Activity Interface for Recent Activity Feed
export interface Activity {
  description: string;
  timeAgo: string;
  icon: string; // e.g. "bi-check-circle"
  statusColor: string; // e.g. "success"
  timestamp: string;
}

export interface TodayClass {
  courseId: number;
  courseName: string;
  courseCode: string;
  className: string;
  startTime: string;
  endTime: string;
}

export interface CourseAttendance {
  courseId: number;
  courseName: string;
  shortName: string;
  courseCode: string;
  attendedClasses: number;
  totalClasses: number;
  percentage: number;
  status: 'Good' | 'Warning' | 'Critical';
}

export interface DashboardResponse {
  // Admin Stats
  totalTeachers?: number;
  totalStudents?: number;
  totalClasses?: number;
  totalCourses?: number;

  // ✅ Admin Recent Activity (Crucial for Admin Dashboard)
  recentActivities?: Activity[];

  // Student/Teacher Stats
  todayClasses?: TodayClass[];
  pendingUnlockRequests?: number;
  courseAttendances?: CourseAttendance[];
  overallAttendance?: number;
  attendanceSummary?: { [key: string]: number };
}
