import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/student`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return { headers: this.authService.getAuthHeaders() };
  }

  getStudentDashboard(year?: string, sem?: string): Observable<any> {
    let params = new HttpParams();
    if (year && year !== 'Select Year' && year !== 'All') {
      params = params.set('academicYear', year);
    }
    if (sem && sem !== 'Select Semester' && sem !== 'All') {
      params = params.set('semester', sem);
    }
    return this.http.get<any>(`${this.apiUrl}/dashboard`, {
      ...this.getHeaders(),
      params,
    });
  }

  getStudentAttendance(
    courseId?: number,
    startDate?: string,
    endDate?: string
  ): Observable<any[]> {
    let params = new HttpParams();
    if (courseId) params = params.set('courseId', courseId);
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<any[]>(`${this.apiUrl}/attendance`, {
      ...this.getHeaders(),
      params,
    });
  }

  // 🔴 NEW: Leave Request Methods
  createLeaveRequest(leaveData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave`, leaveData, this.getHeaders());
  }

  getLeaveRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leave`, this.getHeaders());
  }
}
