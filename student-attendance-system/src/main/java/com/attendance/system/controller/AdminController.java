package com.attendance.system.controller;

import com.attendance.system.dto.request.*;
import com.attendance.system.dto.response.*;
import com.attendance.system.entity.*;
import com.attendance.system.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Global CORS is handled in WebConfig, but this ensures specific controller access if needed
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/admin")
// @PreAuthorize("hasRole('ADMIN')") // Uncomment if you have role-based security fully set up
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ---------------- DASHBOARD ----------------
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getAdminDashboard());
    }

    // ---------------- TEACHER MANAGEMENT ----------------
    @PostMapping("/teachers")
    public ResponseEntity<UserInfoResponse> createTeacher(@Valid @RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(adminService.createTeacher(signupRequest));
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<UserInfoResponse>> getAllTeachers() {
        return ResponseEntity.ok(adminService.getAllTeachers());
    }
    
    @GetMapping("/teachers/{teacherId}")
    public ResponseEntity<UserInfoResponse> getTeacherById(@PathVariable Long teacherId) {
        return ResponseEntity.ok(adminService.getTeacherById(teacherId));
    }

    @PutMapping("/teachers/{teacherId}")
    public ResponseEntity<UserInfoResponse> updateTeacher(@PathVariable Long teacherId,
                                                          @Valid @RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(adminService.updateTeacher(teacherId, signupRequest));
    }

    @DeleteMapping("/teachers/{teacherId}")
    public ResponseEntity<String> deleteTeacher(@PathVariable Long teacherId) {
        adminService.deleteTeacher(teacherId);
        return ResponseEntity.ok("Teacher deleted successfully");
    }

    // ---------------- STUDENT MANAGEMENT ----------------
    @PostMapping("/students")
    public ResponseEntity<StudentResponse> createStudent(@RequestBody StudentRequest request) {
        return ResponseEntity.ok(adminService.createStudent(request));
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }
    
    @GetMapping("/students/{studentId}")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long studentId) {
        return ResponseEntity.ok(adminService.getStudentById(studentId));
    }

    @PutMapping("/students/{studentId}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long studentId,
            @RequestBody UpdateStudentRequest request) {
        return ResponseEntity.ok(adminService.updateStudent(studentId, request));
    }

    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long studentId) {
        adminService.deleteStudent(studentId);
        return ResponseEntity.ok("Student deleted successfully");
    }

    // ---------------- CLASS MANAGEMENT ----------------
    @GetMapping("/classes")
    public ResponseEntity<List<ClassEntity>> getAllClasses() {
        return ResponseEntity.ok(adminService.getAllClasses());
    }

    @PostMapping("/classes")
    public ResponseEntity<ClassEntity> createClass(@RequestBody ClassEntity classEntity) {
        return ResponseEntity.ok(adminService.createClass(classEntity));
    }

    @PutMapping("/classes/{classId}")
    public ResponseEntity<ClassEntity> updateClass(@PathVariable Long classId,
                                                   @RequestBody ClassEntity classEntity) {
        return ResponseEntity.ok(adminService.updateClass(classId, classEntity));
    }

    @DeleteMapping("/classes/{classId}")
    public ResponseEntity<String> deleteClass(@PathVariable Long classId) {
        adminService.deleteClass(classId);
        return ResponseEntity.ok("Class deleted successfully");
    }

    // ---------------- COURSE MANAGEMENT ----------------
    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @PostMapping("/courses")
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseRequest request) {
        return ResponseEntity.ok(adminService.createCourse(request));
    }

    @PutMapping("/courses/{courseId}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long courseId,
                                                       @RequestBody CourseRequest request) {
        return ResponseEntity.ok(adminService.updateCourse(courseId, request));
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long courseId) {
        adminService.deleteCourse(courseId);
        return ResponseEntity.ok("Course deleted successfully");
    }

    // ---------------- UNLOCK REQUESTS (UPDATED) ----------------
    
    // ✅ FIX: Use getAllUnlockRequests to show history (Approved/Rejected) not just pending
    @GetMapping("/unlock-requests")
    public ResponseEntity<List<UnlockRequest>> getAllUnlockRequests() {
        return ResponseEntity.ok(adminService.getAllUnlockRequests());
    }

    // ✅ FIX: Endpoint for the stats cards on the Unlock page
    @GetMapping("/unlock-requests/stats")
    public ResponseEntity<UnlockStatsResponse> getUnlockStats() {
        return ResponseEntity.ok(adminService.getUnlockStats());
    }

    @PostMapping("/unlock-requests/{requestId}/process")
    public ResponseEntity<UnlockRequest> processUnlockRequest(@PathVariable Long requestId,
                                                              @RequestParam boolean approve) {
        return ResponseEntity.ok(adminService.processUnlockRequest(requestId, approve));
    }

    // ---------------- REPORTS ----------------
    @GetMapping("/attendance-reports") // Ensure this matches your frontend URL
    public ResponseEntity<List<AttendanceReportResponse>> getAttendanceReports() {
        return ResponseEntity.ok(adminService.getAttendanceReports());
    }
}