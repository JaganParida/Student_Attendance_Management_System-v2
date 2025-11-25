package com.attendance.system.controller;

import com.attendance.system.dto.response.AttendanceDetailResponse;
import com.attendance.system.dto.response.StudentDashboardResponse;
import com.attendance.system.entity.Student;
import com.attendance.system.repository.StudentRepository;
import com.attendance.system.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired private StudentService studentService;
    @Autowired private StudentRepository studentRepository;

    private Long getCurrentStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return student.getId();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardResponse> getDashboard(
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) String semester) {
        
        if ("All".equalsIgnoreCase(academicYear) || "".equals(academicYear)) academicYear = null;
        if ("All".equalsIgnoreCase(semester) || "".equals(semester)) semester = null;

        return ResponseEntity.ok(studentService.getStudentDashboard(getCurrentStudentId(), academicYear, semester));
    }

    // 🔴 NEW ENDPOINT: This was missing, causing the 404 error
    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceDetailResponse>> getAttendanceHistory(
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // Default to last 30 days if no date range provided
        if (startDate == null) startDate = LocalDate.now().minusDays(30);
        if (endDate == null) endDate = LocalDate.now();

        return ResponseEntity.ok(studentService.getStudentAttendance(getCurrentStudentId(), courseId, startDate, endDate));
    }
}