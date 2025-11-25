package com.attendance.system.service.impl;

import com.attendance.system.dto.request.AttendanceMarkRequest;
import com.attendance.system.dto.request.PasswordChangeDTO;
import com.attendance.system.dto.request.UnlockRequestDTO;
import com.attendance.system.dto.response.*;
import com.attendance.system.entity.*;
import com.attendance.system.repository.*;
import com.attendance.system.service.TeacherService;
import com.attendance.system.exception.AttendanceRuleViolationException;
import com.attendance.system.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    private static final ZoneId KOLKATA_ZONE = ZoneId.of("Asia/Kolkata");

    @Autowired private CourseRepository courseRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private UnlockRequestRepository unlockRequestRepository;
    @Autowired private TeacherRepository teacherRepository;
    @Autowired private AttendanceRepository attendanceRepository;
    @Autowired private LeaveRequestRepository leaveRequestRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    
    // ✅ HELPER: 15 Minute Window Logic
    private boolean isWithinAttendanceWindow(Course course) {
        if (course.getStartTime() == null) return false;
        LocalTime now = LocalTime.now(KOLKATA_ZONE);
        // Window starts 5 mins before and ends exactly 15 mins after start
        LocalTime windowStart = course.getStartTime().minusMinutes(5);
        LocalTime windowEnd = course.getStartTime().plusMinutes(15);
        return !now.isBefore(windowStart) && !now.isAfter(windowEnd);
    }

    private void enforceTimeWindow(Course course) {
        if (!isWithinAttendanceWindow(course)) {
             throw new AttendanceRuleViolationException("Attendance window closed.");
        }
    }

    // ================= DASHBOARD & CLASSES =================
    
    @Override
    @Transactional(readOnly = true) 
    public TeacherDashboardResponse getTeacherDashboard(Long teacherId) {
        long totalCourses = courseRepository.countByTeacherId(teacherId);
        long totalStudents = studentRepository.countStudentsByTeacherId(teacherId);
        long pendingUnlockRequests = unlockRequestRepository.countByTeacherIdAndStatus(teacherId, UnlockRequest.Status.PENDING);
        long pendingLeaveRequests = leaveRequestRepository.countByTeacherIdAndStatus(teacherId, LeaveRequest.Status.PENDING);
        long attendanceMarkedToday = attendanceRepository.countByTeacherIdAndDate(teacherId, LocalDate.now(KOLKATA_ZONE));

        DayOfWeek today = LocalDate.now(KOLKATA_ZONE).getDayOfWeek();
        LocalDate todayDate = LocalDate.now(KOLKATA_ZONE);
        LocalTime now = LocalTime.now(KOLKATA_ZONE);

        List<TodayClassDTO> todayClasses = courseRepository.findTodayClassesByTeacherId(teacherId, today);
        
        for (TodayClassDTO dto : todayClasses) {
            // 1. Fetch Data
            List<Boolean> lockStatus = attendanceRepository.findIsLockedStatusByCourseIdAndDate(dto.getId(), todayDate);
            boolean attendanceExists = !lockStatus.isEmpty();
            boolean isAttendanceUnlocked = attendanceExists && !lockStatus.get(0);

            List<UnlockRequest> requests = unlockRequestRepository.findByCourseIdAndDate(dto.getId(), todayDate);
            boolean isRequestApproved = requests.stream().anyMatch(r -> r.getStatus() == UnlockRequest.Status.APPROVED);
            boolean isRequestPending = requests.stream().anyMatch(r -> r.getStatus() == UnlockRequest.Status.PENDING);

            // 2. Set Flags
            dto.setIsUnlockedByAdmin(isAttendanceUnlocked || isRequestApproved);
            dto.setHasPendingRequest(isRequestPending);
            dto.setIsAttendanceMarked(attendanceExists);

            // 3. STRICT STATUS PRIORITY LOGIC
            
            // A. UNLOCKED (Approved) -> "Update"
            if (dto.getIsUnlockedByAdmin()) {
                dto.setStatus("Unlocked");
            }
            // B. PENDING (Waiting) -> "Wait"
            else if (dto.isHasPendingRequest()) {
                dto.setStatus("Pending");
            }
            // C. TIME CHECKS
            else {
                boolean isStarted = !now.isBefore(dto.getStartTime());
                boolean isWithin15Mins = !now.isAfter(dto.getStartTime().plusMinutes(15));
                
                if (now.isBefore(dto.getStartTime().minusMinutes(5))) {
                     dto.setStatus("Upcoming");
                } 
                else if (isStarted && isWithin15Mins) {
                    dto.setStatus("Ongoing"); // Frontend decides Mark vs Update using isAttendanceMarked
                } 
                else {
                    // D. EXPIRED LOGIC (Check 2-Day Limit)
                    long daysBetween = ChronoUnit.DAYS.between(todayDate, LocalDate.now(KOLKATA_ZONE));
                    
                    if (daysBetween > 2) {
                        dto.setStatus("NotAllowed"); // 🔴 > 2 days -> Blocked
                    } else {
                        dto.setStatus("Expired");    // 🔴 <= 2 days -> Can Request Unlock
                    }
                }
            }
        }
        
        return new TeacherDashboardResponse(
            totalCourses, totalStudents, attendanceMarkedToday, 
            pendingUnlockRequests, pendingLeaveRequests, todayClasses
        );
    }
    
    // ... (The rest of your file remains exactly as provided previously)
    @Override
    public List<TodayClassDTO> getTodayClasses(Long teacherId) {
        return courseRepository.findTodayClassesByTeacherId(teacherId, LocalDate.now(KOLKATA_ZONE).getDayOfWeek());
    }
    @Override
    public List<CourseResponse> getTeacherCourses(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId).stream().map(this::mapToCourseResponse).collect(Collectors.toList());
    }
    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getClassAttendance(Long courseId, LocalDate date) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        List<Attendance> existingAttendance = attendanceRepository.findByCourseAndDate(course, date);
        if (existingAttendance.isEmpty()) {
             return getStudentsByCourse(courseId).stream()
                 .map(s -> new AttendanceResponse(s.getId(), s.getName(), s.getRollNumber(), null))
                 .collect(Collectors.toList());
        }
        Map<Long, Attendance.Status> statusMap = existingAttendance.stream()
                .collect(Collectors.toMap(a -> a.getStudent().getId(), Attendance::getStatus));
        return getStudentsByCourse(courseId).stream()
                .map(s -> new AttendanceResponse(s.getId(), s.getName(), s.getRollNumber(), statusMap.getOrDefault(s.getId(), null))) 
                .collect(Collectors.toList());
    }
    @Override
    public boolean canMarkAttendance(Long courseId, LocalDate date) {
        if (!date.equals(LocalDate.now(KOLKATA_ZONE))) return false;
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null || course.getStartTime() == null) return true;
        return isWithinAttendanceWindow(course);
    }
    @Override
    @Transactional(readOnly = true)
    public boolean canEditAttendance(Long courseId, LocalDate date) {
        long daysBetween = ChronoUnit.DAYS.between(date, LocalDate.now(KOLKATA_ZONE));
        if (daysBetween < 0 || daysBetween > 2) return false;
        if (canMarkAttendance(courseId, date)) return true; 
        List<Boolean> lockStatuses = attendanceRepository.findIsLockedStatusByCourseIdAndDate(courseId, date);
        if (lockStatuses.isEmpty()) {
            List<UnlockRequest> requests = unlockRequestRepository.findByCourseIdAndDate(courseId, date);
            return requests.stream().anyMatch(r -> r.getStatus() == UnlockRequest.Status.APPROVED);
        }
        return !lockStatuses.get(0); 
    }
    @Override
    @Transactional
    public String markAttendance(AttendanceMarkRequest request, Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));
        Course course = courseRepository.findById(request.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        enforceTimeWindow(course);
        if (attendanceRepository.existsByCourseAndDate(course, request.getDate())) {
            throw new AttendanceRuleViolationException("Attendance already marked.");
        }
        LocalDateTime now = LocalDateTime.now(KOLKATA_ZONE);
        List<Attendance> newAttendances = new ArrayList<>();
        for (AttendanceMarkRequest.StudentAttendance attReq : request.getAttendanceList()) {
            Student student = studentRepository.findById(attReq.getStudentId()).orElseThrow(() -> new ResourceNotFoundException("Student", "id", attReq.getStudentId()));
            Attendance attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setCourse(course);
            attendance.setDate(request.getDate());
            attendance.setStatus(attReq.getStatus());
            attendance.setTeacher(teacher);
            attendance.setMarkedAt(now);
            attendance.setMarkedBy(teacher.getName());
            attendance.setStartTime(course.getStartTime());
            attendance.setEndTime(course.getEndTime());
            attendance.setIsLocked(true); 
            newAttendances.add(attendance);
        }
        attendanceRepository.saveAll(newAttendances);
        return "Attendance marked successfully!";
    }
    @Override
    @Transactional
    public void updateAttendance(AttendanceMarkRequest request, Long teacherId) {
        Course course = courseRepository.findById(request.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        if (!canEditAttendance(request.getCourseId(), request.getDate())) {
            throw new AttendanceRuleViolationException("Editing not allowed. Time expired or Locked.");
        }
        List<Attendance> existingAttendance = attendanceRepository.findByCourseAndDate(course, request.getDate());
        if (existingAttendance.isEmpty()) throw new ResourceNotFoundException("Attendance", "date", request.getDate());
        Map<Long, Attendance> attendanceMap = existingAttendance.stream().collect(Collectors.toMap(att -> att.getStudent().getId(), att -> att));
        for (AttendanceMarkRequest.StudentAttendance attReq : request.getAttendanceList()) {
            Attendance record = attendanceMap.get(attReq.getStudentId());
            if (record != null && record.getStatus() != attReq.getStatus()) {
                record.setStatus(attReq.getStatus());
                record.setMarkedAt(LocalDateTime.now(KOLKATA_ZONE));
            }
        }
        attendanceRepository.saveAll(attendanceMap.values());
    }
    @Override
    public List<StudentSummaryDTO> getStudentsByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        if(course.getClassEntity() != null) {
             return studentRepository.findByClassEntityId(course.getClassEntity().getId()).stream()
                 .map(s -> new StudentSummaryDTO(s.getId(), s.getName(), s.getRollNumber(), s.getEmail())).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
    @Override
    public StudentPerformanceDTO getStudentPerformance(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        long total = attendanceRepository.countByCourseIdAndStudentId(courseId, studentId);
        long present = attendanceRepository.countByCourseIdAndStudentIdAndStatus(courseId, studentId, Attendance.Status.PRESENT);
        double percentage = total == 0 ? 0.0 : ((double) present / total) * 100;
        return new StudentPerformanceDTO(student.getId(), student.getName(), percentage, (int)total, (int)present);
    }
    @Override
    public UnlockRequest createUnlockRequest(UnlockRequestDTO dto, Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));
        Course course = courseRepository.findById(dto.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course", "id", dto.getCourseId()));
        UnlockRequest req = new UnlockRequest();
        req.setTeacher(teacher);
        req.setCourse(course);
        req.setRequestDate(dto.getDate());
        req.setReason(dto.getReason());
        req.setStatus(UnlockRequest.Status.PENDING);
        req.setCreatedAt(LocalDateTime.now(KOLKATA_ZONE));
        req.setRequestType(dto.getRequestType()); 
        return unlockRequestRepository.save(req);
    }
    @Override
    public void requestUnlock(Long teacherId, Long courseId, String reason) {
        UnlockRequestDTO dto = new UnlockRequestDTO();
        dto.setCourseId(courseId);
        dto.setDate(LocalDate.now(KOLKATA_ZONE));
        dto.setReason(reason);
        dto.setRequestType("GENERAL");
        createUnlockRequest(dto, teacherId);
    }
    @Override
    public List<UnlockRequest> getTeacherUnlockRequests(Long teacherId) {
        return unlockRequestRepository.findByTeacherId(teacherId);
    }
    @Override
    public List<LeaveRequestResponse> getPendingLeaveRequests(Long teacherId) {
        List<LeaveRequest> requests = leaveRequestRepository.findByTeacherIdAndStatus(teacherId, LeaveRequest.Status.PENDING);
        return requests.stream().map(this::mapToLeaveResponse).collect(Collectors.toList());
    }
    @Override
    public List<LeaveRequestResponse> getTeacherLeaveHistory(Long teacherId) {
        List<LeaveRequest> requests = leaveRequestRepository.findByTeacherIdAndStatusInOrderByProcessedAtDesc(
            teacherId, 
            Arrays.asList(LeaveRequest.Status.APPROVED, LeaveRequest.Status.REJECTED)
        );
        return requests.stream().map(this::mapToLeaveResponse).collect(Collectors.toList());
    }
    @Override
    public LeaveRequestResponse processLeaveRequest(Long requestId, boolean approve, Long teacherId) {
        LeaveRequest request = leaveRequestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", requestId));
        if (!request.getTeacher().getId().equals(teacherId)) {
            throw new RuntimeException("Unauthorized Access to Leave Request");
        }
        request.setStatus(approve ? LeaveRequest.Status.APPROVED : LeaveRequest.Status.REJECTED);
        request.setProcessedAt(LocalDateTime.now(KOLKATA_ZONE));
        LeaveRequest saved = leaveRequestRepository.save(request);
        return mapToLeaveResponse(saved);
    }
    private LeaveRequestResponse mapToLeaveResponse(LeaveRequest req) {
        LeaveRequestResponse response = new LeaveRequestResponse();
        response.setId(req.getId());
        response.setCourseName(req.getCourse() != null ? req.getCourse().getCourseName() : "Unknown");
        response.setCourseCode(req.getCourse() != null ? req.getCourse().getCourseCode() : "N/A");
        if (req.getStudent() != null) {
            response.setStudentName(req.getStudent().getName());
            response.setRollNumber(req.getStudent().getRollNumber());
        }
        response.setTeacherName(req.getTeacher() != null ? req.getTeacher().getName() : "Unknown");
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
    public TeacherProfileDTO getTeacherProfile(Long teacherId) {
        Teacher t = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));
        return new TeacherProfileDTO(t.getId(), t.getName(), t.getEmail(), t.getPhone(), t.getDepartment());
    }
    @Override
    public TeacherProfileDTO updateTeacherProfile(Long teacherId, TeacherProfileDTO dto) {
        Teacher t = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));
        t.setName(dto.getFirstName() + (dto.getLastName() != null ? " " + dto.getLastName() : ""));
        t.setPhone(dto.getPhone());
        t.setDepartment(dto.getDepartment());
        teacherRepository.save(t);
        return dto;
    }
    @Override
    public void changePassword(Long teacherId, PasswordChangeDTO dto) {
         Teacher t = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", teacherId));
         if (!passwordEncoder.matches(dto.getCurrentPassword(), t.getPassword())) {
             throw new RuntimeException("Incorrect current password");
         }
         t.setPassword(passwordEncoder.encode(dto.getNewPassword()));
         teacherRepository.save(t);
    }
    private CourseResponse mapToCourseResponse(Course c) {
        CourseResponse response = new CourseResponse();
        response.setId(c.getId());
        response.setCourseCode(c.getCourseCode());
        response.setCourseName(c.getCourseName());
        response.setShortName(c.getShortName());
        response.setDescription(c.getDescription());
        if(c.getTeacher() != null) {
            response.setTeacherId(c.getTeacher().getId());
            response.setTeacherName(c.getTeacher().getName());
        }
        if(c.getClassEntity() != null) {
            response.setClassId(c.getClassEntity().getId());
            response.setClassName(c.getClassEntity().getClassName());
            response.setSection(c.getClassEntity().getSection());
        }
        if(c.getDayOfWeek() != null) response.setDayOfWeek(c.getDayOfWeek());
        response.setStartTime(c.getStartTime());
        response.setEndTime(c.getEndTime());
        response.setClassRoom(c.getClassRoom());
        return response;
    }
}