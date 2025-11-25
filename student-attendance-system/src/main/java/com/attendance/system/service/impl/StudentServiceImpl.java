package com.attendance.system.service.impl;

import com.attendance.system.dto.request.LeaveRequestDTO;
import com.attendance.system.dto.response.*;
import com.attendance.system.entity.*;
import com.attendance.system.repository.*;
import com.attendance.system.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired private StudentRepository studentRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private AttendanceRepository attendanceRepository;
    @Autowired private LeaveRequestRepository leaveRequestRepository;

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(Long studentId, String academicYear, String semester) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ClassEntity currentClass = student.getClassEntity();

        StudentDashboardResponse response = new StudentDashboardResponse();
        response.setStudentName(student.getName());
        response.setRollNumber(student.getRollNumber());
        
        if (currentClass != null) {
            response.setSemester(currentClass.getSemester());
            response.setAcademicYear(currentClass.getAcademicYear());
        } else {
            response.setSemester("N/A");
            response.setAcademicYear("N/A");
        }

        Set<Course> uniqueCourses = new HashSet<>();
        if (currentClass != null) {
            uniqueCourses.addAll(courseRepository.findByClassEntity(currentClass));
        }
        uniqueCourses.addAll(attendanceRepository.findCoursesByStudentId(studentId));

        List<Course> filteredCourses = uniqueCourses.stream()
            .filter(c -> {
                boolean yearMatch = (academicYear == null);
                if (!yearMatch && c.getClassEntity() != null) {
                    yearMatch = academicYear.equalsIgnoreCase(c.getClassEntity().getAcademicYear());
                }

                boolean semMatch = (semester == null);
                if (!semMatch && c.getClassEntity() != null) {
                    String dbSem = c.getClassEntity().getSemester();
                    String dbSemNum = dbSem != null ? dbSem.replaceAll("\\D+", "") : "";
                    String reqSemNum = semester.replaceAll("\\D+", "");
                    semMatch = dbSemNum.equals(reqSemNum) || dbSem.equalsIgnoreCase(semester);
                }

                return yearMatch && semMatch;
            })
            .collect(Collectors.toList());

        List<CourseAttendanceDTO> courseStats = new ArrayList<>();
        int totalClassesOverall = 0;
        int totalPresentOverall = 0;

        for (Course course : filteredCourses) {
            long total = attendanceRepository.countTotalByStudentAndCourse(student, course);
            long present = attendanceRepository.countPresentByStudentAndCourse(student, course);
            
            double percentage = (total > 0) ? ((double) present / total) * 100 : 0.0;
            percentage = Math.round(percentage * 10.0) / 10.0;

            courseStats.add(new CourseAttendanceDTO(
                course.getId(),
                course.getCourseName(),
                course.getCourseCode(),
                (int) total,
                (int) present,
                percentage
            ));

            totalClassesOverall += total;
            totalPresentOverall += present;
        }

        response.setCourseAttendances(courseStats);

        double overallPercentage = (totalClassesOverall > 0) 
            ? ((double) totalPresentOverall / totalClassesOverall) * 100 
            : 0.0;
        response.setOverallAttendance(Math.round(overallPercentage * 10.0) / 10.0);

        return response;
    }

    @Override
    public List<AttendanceDetailResponse> getStudentAttendance(Long studentId, Long courseId, LocalDate startDate, LocalDate endDate) {
        Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        List<Attendance> logs;
        if (courseId != null) {
            Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
            logs = attendanceRepository.findByStudentAndCourse(student, course);
        } else {
            logs = attendanceRepository.findByStudentAndDateBetween(student, startDate, endDate);
        }
        return logs.stream().map(log -> new AttendanceDetailResponse(
                log.getId(), log.getDate(), (log.getStatus() != null ? log.getStatus().toString() : "UNKNOWN"), 
                log.getCourse().getCourseName(), log.getCourse().getCourseCode(), log.getStartTime(), log.getEndTime()
        )).collect(Collectors.toList());
    }

    // ================= NEW LEAVE REQUEST LOGIC =================

    @Override
    @Transactional
    public LeaveRequestResponse createLeaveRequest(LeaveRequestDTO dto, Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        LeaveRequest request = new LeaveRequest();
        request.setStudent(student);
        request.setCourse(course);
        
        // Ensure Course has a teacher
        if (course.getTeacher() == null) {
            throw new RuntimeException("Cannot apply for leave: No teacher assigned to this course.");
        }
        request.setTeacher(course.getTeacher()); 
        
        request.setStartDate(dto.getStartDate());
        request.setEndDate(dto.getEndDate());
        request.setReason(dto.getReason());
        request.setType(dto.getType() != null ? dto.getType() : "Personal"); 
        request.setStatus(LeaveRequest.Status.PENDING);
        
        LeaveRequest savedRequest = leaveRequestRepository.save(request);
        
        // Return DTO
        return mapToResponse(savedRequest);
    }

    @Override
    public List<LeaveRequestResponse> getStudentLeaveRequests(Long studentId) {
        List<LeaveRequest> requests = leaveRequestRepository.findByStudentIdOrderByRequestedAtDesc(studentId);
        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Helper: Map Entity -> DTO
    private LeaveRequestResponse mapToResponse(LeaveRequest req) {
        LeaveRequestResponse response = new LeaveRequestResponse();
        response.setId(req.getId());
        response.setCourseName(req.getCourse() != null ? req.getCourse().getCourseName() : "Unknown");
        response.setCourseCode(req.getCourse() != null ? req.getCourse().getCourseCode() : "N/A");
        response.setTeacherName(req.getTeacher() != null ? req.getTeacher().getName() : "Unknown");
        
        if (req.getStudent() != null) {
            response.setStudentName(req.getStudent().getName());
            response.setRollNumber(req.getStudent().getRollNumber());
        }

        response.setStartDate(req.getStartDate());
        response.setEndDate(req.getEndDate());
        response.setReason(req.getReason());
        response.setType(req.getType());
        response.setStatus(req.getStatus().toString());
        response.setRequestedAt(req.getRequestedAt());
        response.setProcessedAt(req.getProcessedAt());
        response.setRemarks(req.getRemarks());
        return response;
    }

    @Override
    public Double calculateOverallAttendance(Long studentId, String academicYear, String semester) {
        return getStudentDashboard(studentId, academicYear, semester).getOverallAttendance();
    }
}