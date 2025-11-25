// src/app/core/models/course.model.ts

// This matches the CourseResponse DTO from the backend
export interface CourseResponse {
  id: number;
  courseCode: string;
  courseName: string;
  shortName: string;
  description: string;
  teacherId: number;
  teacherName: string;
  classId: number;
  className: string;
  section: string;

  // New schedule fields
  dayOfWeek: string; // e.g., "MONDAY"
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "10:00"
  classRoom: string;
}

// This matches the CourseRequest DTO
export interface CourseRequest {
  courseCode: string;
  courseName: string;
  shortName: string;
  description: string;
  teacherId: number;
  classId: number;

  // New schedule fields
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  classRoom: string;
}
