package com.attendance.system.service;

import com.attendance.system.dto.request.*;
import com.attendance.system.dto.response.*;
import com.attendance.system.entity.UnlockRequest;

import java.time.LocalDate;
import java.util.List;

public interface TeacherService {
    
    // --- Dashboard & Courses ---
    TeacherDashboardResponse getTeacherDashboard(Long teacherId);
    List<TodayClassDTO> getTodayClasses(Long teacherId);
    List<CourseResponse> getTeacherCourses(Long teacherId);

    // --- Attendance ---
    List<AttendanceResponse> getClassAttendance(Long courseId, LocalDate date);
    boolean canMarkAttendance(Long courseId, LocalDate date);
    boolean canEditAttendance(Long courseId, LocalDate date);
    String markAttendance(AttendanceMarkRequest request, Long teacherId);
    void updateAttendance(AttendanceMarkRequest request, Long teacherId);

    // --- Students ---
    List<StudentSummaryDTO> getStudentsByCourse(Long courseId);
    StudentPerformanceDTO getStudentPerformance(Long studentId, Long courseId);

    // --- Unlock Requests ---
    UnlockRequest createUnlockRequest(UnlockRequestDTO dto, Long teacherId);
    void requestUnlock(Long teacherId, Long courseId, String reason);
    List<UnlockRequest> getTeacherUnlockRequests(Long teacherId);
    
    // --- Leave Requests (UPDATED) ---
    List<LeaveRequestResponse> getPendingLeaveRequests(Long teacherId);
    
    // ✅ NEW: History
    List<LeaveRequestResponse> getTeacherLeaveHistory(Long teacherId);
    
    LeaveRequestResponse processLeaveRequest(Long requestId, boolean approve, Long teacherId);

    // --- Profile ---
    TeacherProfileDTO getTeacherProfile(Long teacherId);
    TeacherProfileDTO updateTeacherProfile(Long teacherId, TeacherProfileDTO dto);
    void changePassword(Long teacherId, PasswordChangeDTO dto);
}