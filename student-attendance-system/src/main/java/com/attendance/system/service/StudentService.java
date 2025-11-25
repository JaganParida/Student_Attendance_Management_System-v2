package com.attendance.system.service;

import com.attendance.system.dto.request.LeaveRequestDTO;
import com.attendance.system.dto.response.StudentDashboardResponse;
import com.attendance.system.dto.response.AttendanceDetailResponse;
import com.attendance.system.entity.LeaveRequest;

import java.time.LocalDate;
import java.util.List;

public interface StudentService {

    // --- 2. UPDATE SIGNATURE ---
    StudentDashboardResponse getStudentDashboard(Long studentId, String academicYear, String semester);

    // --- 3. UPDATE SIGNATURE ---
    List<AttendanceDetailResponse> getStudentAttendance(Long studentId, Long courseId, LocalDate startDate, LocalDate endDate);
    
    LeaveRequest createLeaveRequest(LeaveRequestDTO requestDTO, Long studentId);
    
    List<LeaveRequest> getStudentLeaveRequests(Long studentId);
    
    Double calculateOverallAttendance(Long studentId, String academicYear, String semester);
}