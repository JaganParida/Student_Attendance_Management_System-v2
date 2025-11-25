package com.attendance.system.controller;

import com.attendance.system.dto.request.*;
import com.attendance.system.dto.response.*;
// Explicit import to avoid conflicts
import com.attendance.system.dto.response.StudentPerformanceDTO; 

import com.attendance.system.entity.Teacher;
import com.attendance.system.entity.UnlockRequest;
import com.attendance.system.repository.TeacherRepository;
import com.attendance.system.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/teacher")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TeacherController {

    @Autowired private TeacherService teacherService;
    @Autowired private TeacherRepository teacherRepository;

    private Long getCurrentTeacherId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String teacherEmail = authentication.getName();
        Teacher teacher = teacherRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        return teacher.getId();
    }

    // ... existing attendance endpoints ...
    
    @GetMapping("/attendance/rules/check")
    public ResponseEntity<Boolean> checkAttendanceRules(
            @RequestParam Long courseId, @RequestParam String date, @RequestParam boolean isEdit) {
        LocalDate checkDate = LocalDate.parse(date);
        boolean allowed = isEdit ? 
            teacherService.canEditAttendance(courseId, checkDate) : 
            teacherService.canMarkAttendance(courseId, checkDate);
        return ResponseEntity.ok(allowed);
    }

    @PostMapping("/attendance/mark")
    public ResponseEntity<String> markAttendance(@Valid @RequestBody AttendanceMarkRequest request) {
        return ResponseEntity.ok(teacherService.markAttendance(request, getCurrentTeacherId()));
    }

    @PutMapping("/attendance/update")
    public ResponseEntity<String> updateAttendance(@Valid @RequestBody AttendanceMarkRequest request) {
        teacherService.updateAttendance(request, getCurrentTeacherId());
        return ResponseEntity.ok("Attendance updated successfully.");
    }

    @PostMapping("/unlock-requests")
    public ResponseEntity<UnlockRequest> createUnlockRequest(@Valid @RequestBody UnlockRequestDTO requestDTO) {
        return ResponseEntity.ok(teacherService.createUnlockRequest(requestDTO, getCurrentTeacherId()));
    }

    @GetMapping("/unlock-requests")
    public ResponseEntity<List<UnlockRequest>> getUnlockRequests() {
        return ResponseEntity.ok(teacherService.getTeacherUnlockRequests(getCurrentTeacherId()));
    }
    
    // ✅ FIXED: Now uses the explicitly imported StudentPerformanceDTO from 'dto.response'
    @GetMapping("/students/{studentId}/performance")
    public ResponseEntity<StudentPerformanceDTO> getStudentPerformance(
            @PathVariable Long studentId, @RequestParam Long courseId) {
        return ResponseEntity.ok(teacherService.getStudentPerformance(studentId, courseId));
    }

    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<StudentSummaryDTO>> getStudentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(teacherService.getStudentsByCourse(courseId));
    }

    @GetMapping("/courses/{courseId}/attendance")
    public ResponseEntity<List<AttendanceResponse>> getClassAttendance(
            @PathVariable Long courseId, @RequestParam("date") LocalDate date) {
        return ResponseEntity.ok(teacherService.getClassAttendance(courseId, date));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<TeacherDashboardResponse> getDashboard() {
        return ResponseEntity.ok(teacherService.getTeacherDashboard(getCurrentTeacherId()));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getTeacherCourses() {
        return ResponseEntity.ok(teacherService.getTeacherCourses(getCurrentTeacherId()));
    }
    
    @GetMapping("/leave-requests/pending")
    public ResponseEntity<List<LeaveRequestResponse>> getPendingLeaveRequests() {
        return ResponseEntity.ok(teacherService.getPendingLeaveRequests(getCurrentTeacherId()));
    }

    // ✅ ADDED: Endpoint to fetch history
    @GetMapping("/leave-requests/history")
    public ResponseEntity<List<LeaveRequestResponse>> getLeaveHistory() {
        return ResponseEntity.ok(teacherService.getTeacherLeaveHistory(getCurrentTeacherId()));
    }

    @PostMapping("/leave-requests/{requestId}/process")
    public ResponseEntity<LeaveRequestResponse> processLeaveRequest(@PathVariable Long requestId, @RequestParam boolean approve) {
        return ResponseEntity.ok(teacherService.processLeaveRequest(requestId, approve, getCurrentTeacherId()));
    }
    
    @GetMapping("/profile")
    public ResponseEntity<TeacherProfileDTO> getProfile() {
        return ResponseEntity.ok(teacherService.getTeacherProfile(getCurrentTeacherId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<TeacherProfileDTO> updateProfile(@Valid @RequestBody TeacherProfileDTO profileDTO) {
        return ResponseEntity.ok(teacherService.updateTeacherProfile(getCurrentTeacherId(), profileDTO));
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody PasswordChangeDTO passwordDTO) {
        teacherService.changePassword(getCurrentTeacherId(), passwordDTO);
        return ResponseEntity.ok("Password changed successfully.");
    }
}