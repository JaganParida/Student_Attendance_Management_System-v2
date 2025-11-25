package com.attendance.system.service;

import com.attendance.system.dto.request.*;
import com.attendance.system.dto.response.*;
import com.attendance.system.entity.*;
import java.util.List;

public interface AdminService {
    
    // ---------------- DASHBOARD ----------------
    DashboardResponse getAdminDashboard();

    // ---------------- TEACHER MANAGEMENT ----------------
    UserInfoResponse createTeacher(SignupRequest signupRequest);
    
    List<UserInfoResponse> getAllTeachers();
    
    UserInfoResponse getTeacherById(Long teacherId);
    
    UserInfoResponse updateTeacher(Long teacherId, SignupRequest signupRequest);
    
    void deleteTeacher(Long teacherId);

    // ---------------- STUDENT MANAGEMENT ----------------
    List<StudentResponse> getAllStudents();
    
    StudentResponse getStudentById(Long studentId); 
    
    StudentResponse createStudent(StudentRequest request);
    
    StudentResponse updateStudent(Long studentId, UpdateStudentRequest request);
    
    void deleteStudent(Long studentId);

    // ---------------- CLASS MANAGEMENT ----------------
    List<ClassEntity> getAllClasses();
    
    ClassEntity createClass(ClassEntity classEntity);
    
    ClassEntity updateClass(Long classId, ClassEntity classEntity);
    
    void deleteClass(Long classId);

    // ---------------- COURSE MANAGEMENT ----------------
    List<CourseResponse> getAllCourses();
    
    CourseResponse createCourse(CourseRequest request);
    
    CourseResponse updateCourse(Long courseId, CourseRequest request);
    
    void deleteCourse(Long courseId);
    
    // ---------------- UNLOCK REQUESTS (UPDATED) ----------------
    
    // ✅ FIX: Added missing method for fetching ALL requests (Pending, Approved, Rejected)
    List<UnlockRequest> getAllUnlockRequests();
    
    // ✅ FIX: Added missing method for Stats
    UnlockStatsResponse getUnlockStats();
    
    // Legacy method (can keep if needed)
    List<UnlockRequest> getPendingUnlockRequests();
    
    UnlockRequest processUnlockRequest(Long requestId, boolean approve);

    // ---------------- REPORTS ----------------
    List<AttendanceReportResponse> getAttendanceReports();
}