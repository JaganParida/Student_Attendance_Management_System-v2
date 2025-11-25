export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin extends User {
  adminId: string;
}

export interface Teacher extends User {
  teacherId: string;
  department?: string;
}

export interface Student extends User {
  rollNumber: string;
  parentEmail: string;
  classInfo?: ClassInfo;
}

export interface ClassInfo {
  id: number;
  className: string;
  section: string;
  academicYear: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: string;
  rollNumber?: string;
  parentEmail?: string;
  classId?: number;
  teacherId?: string;
  department?: string;
  adminId?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface UserInfoResponse {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  rollNumber?: string;
  parentEmail?: string;
  classInfo?: ClassInfo;
  teacherId?: string;
  department?: string;
  adminId?: string;
}
