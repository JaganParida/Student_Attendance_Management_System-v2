package com.attendance.system.service;

import com.attendance.system.dto.request.LeaveRequestDTO;
import com.attendance.system.dto.response.AttendanceDetailResponse;
import com.attendance.system.dto.response.LeaveRequestResponse;
import com.attendance.system.dto.response.StudentDashboardResponse;
import java.time.LocalDate;
import java.util.List;

public interface StudentService {
    StudentDashboardResponse getStudentDashboard(Long studentId, String academicYear, String semester);
    List<AttendanceDetailResponse> getStudentAttendance(Long studentId, Long courseId, LocalDate startDate, LocalDate endDate);

    // Updated to return DTOs
    LeaveRequestResponse createLeaveRequest(LeaveRequestDTO dto, Long studentId);
    List<LeaveRequestResponse> getStudentLeaveRequests(Long studentId);
    
    Double calculateOverallAttendance(Long studentId, String academicYear, String semester);
}