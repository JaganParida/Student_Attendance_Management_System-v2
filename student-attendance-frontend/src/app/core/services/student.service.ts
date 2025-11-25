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

  // ✅ Updated to handle filters dynamically
  getStudentDashboard(year?: string, sem?: string): Observable<any> {
    let params = new HttpParams();

    // Only append if value is valid and not default prompt
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
}
