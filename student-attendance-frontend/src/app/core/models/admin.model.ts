export interface CourseRequest {
  courseName: string;
  courseCode: string;
  shortName: string;
  description: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string; // 'MONDAY', 'TUESDAY', etc.
  classRoom: string;
  teacherId: number;
  classId: number;
  studentIds: number[]; // ✅ Added for Student Assignment
}

// Simple interface for the dropdown
export interface StudentOption {
  id: number;
  name: string;
  rollNumber: string;
}
