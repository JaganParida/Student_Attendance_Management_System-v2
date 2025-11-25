import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { AttendanceResponse } from '../models/attendance.model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return { headers: this.authService.getAuthHeaders() };
  }

  getAttendanceByStudentAndCourse(
    studentId: number,
    courseId: number
  ): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(
      `${this.apiUrl}/student/${studentId}/course/${courseId}`,
      this.getHeaders()
    );
  }

  getAttendanceByCourseAndDate(
    courseId: number,
    date: string
  ): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(
      `${this.apiUrl}/course/${courseId}/date/${date}`,
      this.getHeaders()
    );
  }
}
