// Matches your Spring Boot StudentRequest DTO
export interface StudentRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  rollNumber: string;
  parentEmail: string;
  classId: number;
}

// Matches your Spring Boot UpdateStudentRequest DTO
export interface UpdateStudentRequest {
  name: string;
  email: string;
  password?: string; // Password is optional on update
  phone: string;
  rollNumber: string;
  parentEmail: string;
  classId: number;
}

// Matches your Spring Boot StudentResponse DTO
export interface StudentApiResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  parentEmail: string;
  classId: number | null;
  className: string | null;
  section: string | null;
}
