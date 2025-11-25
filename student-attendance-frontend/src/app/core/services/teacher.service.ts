import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = `${environment.apiUrl}/teacher`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return { headers: this.authService.getAuthHeaders() };
  }

  // --- DASHBOARD & COURSES ---

  getTeacherDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`, this.getHeaders());
  }

  getTeacherCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/courses`, this.getHeaders());
  }

  getStudentsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/courses/${courseId}/students`,
      this.getHeaders()
    );
  }

  // --- ATTENDANCE METHODS ---

  getClassAttendance(courseId: number, date: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/courses/${courseId}/attendance?date=${date}`,
      this.getHeaders()
    );
  }

  checkAttendanceRules(
    courseId: number,
    date: string,
    isEdit: boolean
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('courseId', courseId)
      .set('date', date)
      .set('isEdit', isEdit);
    return this.http.get<boolean>(`${this.apiUrl}/attendance/rules/check`, {
      ...this.getHeaders(),
      params,
    });
  }

  markAttendance(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance/mark`, payload, {
      ...this.getHeaders(),
      responseType: 'text',
    });
  }

  updateAttendance(payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/attendance/update`, payload, {
      ...this.getHeaders(),
      responseType: 'text',
    });
  }

  // --- UNLOCK REQUESTS ---

  createUnlockRequest(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/unlock-requests`,
      payload,
      this.getHeaders()
    );
  }

  getUnlockRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/unlock-requests`,
      this.getHeaders()
    );
  }

  // --- LEAVE REQUESTS (UPDATED) ---

  getPendingLeaveRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/leave-requests/pending`,
      this.getHeaders()
    );
  }

  // ✅ Matches the new Backend Endpoint for History
  getProcessedLeaveRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/leave-requests/history`,
      this.getHeaders()
    );
  }

  processLeaveRequest(requestId: number, approve: boolean): Observable<any> {
    const params = new HttpParams().set('approve', approve);
    return this.http.post<any>(
      `${this.apiUrl}/leave-requests/${requestId}/process`,
      {},
      { ...this.getHeaders(), params }
    );
  }
}
