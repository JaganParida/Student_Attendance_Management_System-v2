import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { DashboardResponse } from '../models/api-response.model';
import { UserInfoResponse, SignupRequest } from '../models/user.model';

// --- Student Imports ---
import {
  StudentRequest,
  UpdateStudentRequest,
  StudentApiResponse,
} from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // ✅ Ensure this matches the backend controller path
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return { headers: this.authService.getAuthHeaders() };
  }

  // ================= DASHBOARD =================
  getAdminDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/dashboard`,
      this.getHeaders()
    );
  }

  // ================= TEACHER MANAGEMENT =================
  createTeacher(teacherData: SignupRequest): Observable<UserInfoResponse> {
    return this.http.post<UserInfoResponse>(
      `${this.apiUrl}/teachers`,
      teacherData,
      this.getHeaders()
    );
  }

  getAllTeachers(): Observable<UserInfoResponse[]> {
    return this.http.get<UserInfoResponse[]>(
      `${this.apiUrl}/teachers`,
      this.getHeaders()
    );
  }

  getTeacherById(teacherId: number): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(
      `${this.apiUrl}/teachers/${teacherId}`,
      this.getHeaders()
    );
  }

  updateTeacher(
    teacherId: number,
    teacherData: SignupRequest
  ): Observable<UserInfoResponse> {
    return this.http.put<UserInfoResponse>(
      `${this.apiUrl}/teachers/${teacherId}`,
      teacherData,
      this.getHeaders()
    );
  }

  deleteTeacher(teacherId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/teachers/${teacherId}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text' as 'text',
    });
  }

  // ================= STUDENT MANAGEMENT =================
  createStudent(studentData: StudentRequest): Observable<StudentApiResponse> {
    return this.http.post<StudentApiResponse>(
      `${this.apiUrl}/students`,
      studentData,
      this.getHeaders()
    );
  }

  getAllStudents(): Observable<StudentApiResponse[]> {
    return this.http.get<StudentApiResponse[]>(
      `${this.apiUrl}/students`,
      this.getHeaders()
    );
  }

  // ✅ ADDED: Required for Edit Student feature
  getStudentById(studentId: number): Observable<StudentApiResponse> {
    return this.http.get<StudentApiResponse>(
      `${this.apiUrl}/students/${studentId}`,
      this.getHeaders()
    );
  }

  updateStudent(
    studentId: number,
    studentData: UpdateStudentRequest
  ): Observable<StudentApiResponse> {
    return this.http.put<StudentApiResponse>(
      `${this.apiUrl}/students/${studentId}`,
      studentData,
      this.getHeaders()
    );
  }

  deleteStudent(studentId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/students/${studentId}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text' as 'text',
    });
  }

  // ================= CLASS MANAGEMENT =================
  getAllClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/classes`, this.getHeaders());
  }

  createClass(classData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/classes`,
      classData,
      this.getHeaders()
    );
  }

  updateClass(classId: number, classData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/classes/${classId}`,
      classData,
      this.getHeaders()
    );
  }

  deleteClass(classId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/classes/${classId}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text' as 'text',
    });
  }

  // ================= COURSE MANAGEMENT =================
  getAllCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`, this.getHeaders());
  }

  // Accepts CourseRequest (with studentIds array)
  createCourse(courseData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/courses`,
      courseData,
      this.getHeaders()
    );
  }

  updateCourse(courseId: number, courseData: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/courses/${courseId}`,
      courseData,
      this.getHeaders()
    );
  }

  deleteCourse(courseId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}`, {
      headers: this.authService.getAuthHeaders(),
      responseType: 'text' as 'text',
    });
  }

  // ================= UNLOCK REQUESTS =================

  // ✅ Renamed to 'getAll...' because it now fetches History (Approved/Rejected) too
  getAllUnlockRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/unlock-requests`,
      this.getHeaders()
    );
  }

  // ✅ ADDED: Fetches the counts (Pending, Approved, Rejected) for the cards
  getUnlockStats(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/unlock-requests/stats`,
      this.getHeaders()
    );
  }

  processUnlockRequest(requestId: number, approve: boolean): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/unlock-requests/${requestId}/process?approve=${approve}`,
      {},
      this.getHeaders()
    );
  }

  // ================= REPORTS (NEW) =================
  getAttendanceReports(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/attendance-reports`,
      this.getHeaders()
    );
  }
}
