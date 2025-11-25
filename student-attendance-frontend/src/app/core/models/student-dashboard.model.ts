export interface StudentDashboardResponse {
  courseAttendances: CourseAttendance[];
  overallAttendance: number;
}

export interface CourseAttendance {
  courseId: number;
  courseName: string;
  shortName: string;
  courseCode: string;
  attendedClasses: number;
  totalClasses: number;
  percentage: number;
  status: string;
}

export interface CourseAttendance {
  courseId: number;
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface StudentDashboardResponse {
  studentName: string;
  rollNumber: string;
  courseAttendances: CourseAttendance[];
}
