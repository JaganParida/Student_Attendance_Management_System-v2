package com.attendance.system.service.impl;

import com.attendance.system.dto.request.*;
import com.attendance.system.dto.response.*;
import com.attendance.system.entity.*;
import com.attendance.system.repository.*;
import com.attendance.system.service.AdminService;
import com.attendance.system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication; // Added
import org.springframework.security.core.context.SecurityContextHolder; // Added
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired private TeacherRepository teacherRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private ClassRepository classRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private UnlockRequestRepository unlockRequestRepository;
    @Autowired private AttendanceRepository attendanceRepository; 
    @Autowired private AuthService authService; 
    @Autowired private PasswordEncoder passwordEncoder;
    // NOTE: If you have an AdminRepository, it should be autowired here.

    // =================================================
    // DASHBOARD & RECENT ACTIVITY
    // =================================================
    // ... (All Dashboard and Helper methods remain unchanged)
    
    @Override
    public DashboardResponse getAdminDashboard() {
        DashboardResponse response = new DashboardResponse();
        response.setTotalTeachers(teacherRepository.countByActiveTrue());
        response.setTotalStudents(studentRepository.countByActiveTrue());
        response.setTotalClasses(classRepository.countAllClasses());
        response.setTotalCourses(courseRepository.countAllCourses());
        
        // ✅ POPULATE RECENT ACTIVITY
        response.setRecentActivities(generateRecentActivities());
        
        return response;
    }

    private List<ActivityDTO> generateRecentActivities() {
        List<ActivityDTO> activities = new ArrayList<>();

        // 1. Get recent Unlock Requests (Limit 3)
        List<UnlockRequest> requests = unlockRequestRepository.findAllByOrderByCreatedAtDesc();
        int limit = Math.min(requests.size(), 3);
        for (int i = 0; i < limit; i++) {
            UnlockRequest req = requests.get(i);
            String desc = "Unlock request " + req.getStatus().name().toLowerCase() + " for " + 
                          (req.getTeacher() != null ? req.getTeacher().getName() : "Teacher");
            
            activities.add(new ActivityDTO(
                desc,
                getTimeAgo(req.getCreatedAt()),
                "bi-lock",
                req.getStatus() == UnlockRequest.Status.PENDING ? "warning" : "info",
                req.getCreatedAt()
            ));
        }

        // 2. Get recent Attendance Marked (Limit 3)
        // Note: Requires 'findTop5ByOrderByMarkedAtDesc' in AttendanceRepository
        List<Attendance> attendances = attendanceRepository.findTop5ByOrderByMarkedAtDesc();
        Set<String> seenSessions = new HashSet<>();
        
        for (Attendance att : attendances) {
            if (att.getMarkedAt() == null) continue;
            
            String key = att.getCourse().getId() + "-" + att.getDate();
            if (!seenSessions.contains(key)) {
                seenSessions.add(key);
                String desc = "Attendance marked for " + att.getCourse().getCourseName();
                
                activities.add(new ActivityDTO(
                    desc,
                    getTimeAgo(att.getMarkedAt()),
                    "bi-check-circle",
                    "success",
                    att.getMarkedAt()
                ));
            }
        }

        // 3. Sort combined list by latest first and pick top 5
        return activities.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(5)
                .collect(Collectors.toList());
    }

    private String getTimeAgo(LocalDateTime time) {
        if (time == null) return "Just now";
        Duration duration = Duration.between(time, LocalDateTime.now());
        long minutes = duration.toMinutes();
        
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " mins ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + " hours ago";
        long days = duration.toDays();
        return days + " days ago";
    }

    // =================================================
    // UNLOCK REQUESTS
    // =================================================

    @Override
    public List<UnlockRequest> getAllUnlockRequests() {
        return unlockRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public UnlockStatsResponse getUnlockStats() {
        long pending = unlockRequestRepository.countByStatus(UnlockRequest.Status.PENDING);
        long approved = unlockRequestRepository.countByStatus(UnlockRequest.Status.APPROVED);
        long rejected = unlockRequestRepository.countByStatus(UnlockRequest.Status.REJECTED);
        long total = pending + approved + rejected;
        
        return new UnlockStatsResponse(total, pending, approved, rejected);
    }

    @Override
    public List<UnlockRequest> getPendingUnlockRequests() {
        return unlockRequestRepository.findByStatus(UnlockRequest.Status.PENDING);
    }

    /**
     * FIX: Processes the unlock request and updates the corresponding Attendance 
     * records to be unlocked (isLocked = false) if approved.
     */
    @Override
    @Transactional
    public UnlockRequest processUnlockRequest(Long requestId, boolean approve) {
        UnlockRequest request = unlockRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Unlock request not found"));
        
        request.setStatus(approve ? UnlockRequest.Status.APPROVED : UnlockRequest.Status.REJECTED);

        if (approve) {
            // Get the ID of the Admin currently processing the request (Optional, for tracking)
            Long adminId = getAdminUserId(); 

            // 1. Find all attendance records for the specific course and date
            List<Attendance> recordsToUnlock = attendanceRepository.findByCourseAndDate(
            	    request.getCourse(), 
            	    request.getRequestDate() // <--- Check your UnlockRequest entity for the exact name
            	);

            // 2. Update the lock status on the attendance records
            for (Attendance record : recordsToUnlock) {
                record.setIsLocked(false);
                record.setUnlockApprovedBy(adminId); 
            }
            
            // 3. Save the unlocked attendance records
            attendanceRepository.saveAll(recordsToUnlock);
        }

        // 4. Save the updated UnlockRequest status
        return unlockRequestRepository.save(request);
    }

    /** Helper method to get the current logged-in user's ID. Assuming Admin is a User. */
    private Long getAdminUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user.getId();
        }
        // Fallback or handle unauthenticated case (optional)
        return null; 
    }

    // =================================================
    // REPORT LOGIC
    // =================================================
    // ... (All Report and CRUD methods remain unchanged)
    
    @Override
    public List<AttendanceReportResponse> getAttendanceReports() {
        List<Attendance> allAttendance = attendanceRepository.findAll();

        Map<String, List<Attendance>> groupedBySession = allAttendance.stream()
                .collect(Collectors.groupingBy(a -> 
                    a.getCourse().getId() + "_" + a.getDate().toString()
                ));

        return groupedBySession.values().stream()
                .map(sessionList -> {
                    if (sessionList.isEmpty()) return null;
                    
                    Attendance firstRecord = sessionList.get(0);
                    Course course = firstRecord.getCourse();
                    ClassEntity classEntity = course.getClassEntity();
                    
                    int totalStudents = sessionList.size();
                    int presentCount = (int) sessionList.stream()
                            .filter(this::isPresent) 
                            .count();
                    int absentCount = totalStudents - presentCount;
                    
                    // Prevent Division by Zero
                    double percentage = 0.0;
                    if (totalStudents > 0) {
                        percentage = ((double) presentCount / totalStudents) * 100;
                    }
                    
                    percentage = Math.round(percentage * 10.0) / 10.0;
                    String status = determineStatus(percentage);

                    return new AttendanceReportResponse(
                        classEntity != null ? classEntity.getClassName() + " " + classEntity.getSection() : "-",
                        course.getCourseName(),
                        course.getTeacher() != null ? course.getTeacher().getName() : "Unknown",
                        firstRecord.getDate(),
                        totalStudents,
                        presentCount,
                        absentCount,
                        percentage, 
                        status
                    );
                })
                .filter(java.util.Objects::nonNull)
                .sorted((r1, r2) -> r2.getDate().compareTo(r1.getDate()))
                .collect(Collectors.toList());
    }

    private boolean isPresent(Attendance a) {
        return a.getStatus() != null && "PRESENT".equalsIgnoreCase(String.valueOf(a.getStatus())); 
    }

    private String determineStatus(double percentage) {
        if (percentage >= 90) return "Excellent";
        if (percentage >= 75) return "Good";
        if (percentage >= 60) return "Average";
        return "Needs Attention";
    }

    // ... (All other CRUD methods remain unchanged)
    @Override
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAllActiveWithDetails().stream() 
                .map(course -> {
                    String teacherName = (course.getTeacher() != null) ? course.getTeacher().getName() : "-";
                    String className = (course.getClassEntity() != null) ? course.getClassEntity().getClassName() : "-";
                    String section = (course.getClassEntity() != null) ? course.getClassEntity().getSection() : "-";
                    String shortName = (course.getShortName() != null) ? course.getShortName() : "-";

                    return new CourseResponse(
                        course.getId(),
                        course.getCourseCode(),
                        course.getCourseName(),
                        shortName, 
                        course.getDescription(),
                        course.getTeacher() != null ? course.getTeacher().getId() : null,
                        teacherName, 
                        course.getClassEntity() != null ? course.getClassEntity().getId() : null,
                        className, 
                        section, 
                        course.getDayOfWeek(),
                        course.getStartTime(),
                        course.getEndTime(),
                        course.getClassRoom()
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        Course course = new Course();
        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setShortName(request.getShortName()); 
        course.setDescription(request.getDescription());
        course.setDayOfWeek(request.getDayOfWeek());
        course.setClassRoom(request.getClassRoom());
        course.setStartTime(request.getStartTime());
        course.setEndTime(request.getEndTime());
        course.setActive(true); 

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        course.setTeacher(teacher);

        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        course.setClassEntity(classEntity);

        if (request.getStudentIds() != null && !request.getStudentIds().isEmpty()) {
            List<Student> selectedStudents = studentRepository.findAllById(request.getStudentIds());
            course.setStudents(new HashSet<>(selectedStudents));
        }

        Course saved = courseRepository.save(course);
        return buildCourseResponse(saved, teacher, classEntity);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(Long courseId, CourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setCourseCode(request.getCourseCode());
        course.setCourseName(request.getCourseName());
        course.setShortName(request.getShortName());
        course.setDescription(request.getDescription());
        course.setDayOfWeek(request.getDayOfWeek());
        course.setClassRoom(request.getClassRoom());
        course.setStartTime(request.getStartTime());
        course.setEndTime(request.getEndTime());

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        course.setTeacher(teacher);

        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        course.setClassEntity(classEntity);
        
        if (request.getStudentIds() != null) {
            List<Student> selectedStudents = studentRepository.findAllById(request.getStudentIds());
            course.setStudents(new HashSet<>(selectedStudents));
        }

        Course saved = courseRepository.save(course);
        return buildCourseResponse(saved, teacher, classEntity);
    }

    private CourseResponse buildCourseResponse(Course saved, Teacher teacher, ClassEntity classEntity) {
        return new CourseResponse(
                saved.getId(),
                saved.getCourseCode(),
                saved.getCourseName(),
                (saved.getShortName() != null) ? saved.getShortName() : "-",
                saved.getDescription(),
                teacher.getId(),
                teacher.getName(),
                classEntity.getId(),
                classEntity.getClassName(),
                classEntity.getSection(),
                saved.getDayOfWeek(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getClassRoom()
        );
    }

    @Override
    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        course.setActive(false);
        courseRepository.save(course);
    }

    @Override
    @Transactional
    public UserInfoResponse createTeacher(SignupRequest signupRequest) {
        signupRequest.setRole("TEACHER");
        return authService.registerUser(signupRequest);
    }

    @Override
    public List<UserInfoResponse> getAllTeachers() {
        return teacherRepository.findByActiveTrue()
                .stream()
                .map(this::convertToUserInfoResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserInfoResponse getTeacherById(Long teacherId) {
        Teacher teacher = teacherRepository.findByIdAndActiveTrue(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        return convertToUserInfoResponse(teacher);
    }

    @Override
    @Transactional
    public UserInfoResponse updateTeacher(Long teacherId, SignupRequest signupRequest) {
        Teacher teacher = teacherRepository.findByIdAndActiveTrue(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        teacher.setName(signupRequest.getName());
        teacher.setPhone(signupRequest.getPhone());
        teacher.setDepartment(signupRequest.getDepartment());

        if (signupRequest.getPassword() != null && !signupRequest.getPassword().isBlank()) {
            teacher.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        }

        return convertToUserInfoResponse(teacherRepository.save(teacher));
    }

    @Override
    @Transactional
    public void deleteTeacher(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        teacher.setActive(false);
        teacherRepository.save(teacher); 
    }

    @Override
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findByActiveTrue().stream()
                .map(student -> new StudentResponse(
                        student.getId(),
                        student.getName(),
                        student.getEmail(),
                        student.getPhone(),
                        student.getRollNumber(),
                        student.getParentEmail(),
                        student.getClassEntity() != null ? student.getClassEntity().getId() : null,
                        student.getClassEntity() != null ? student.getClassEntity().getClassName() : null,
                        student.getClassEntity() != null ? student.getClassEntity().getSection() : null
                ))
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponse getStudentById(Long studentId) {
         Student student = studentRepository.findByIdAndActiveTrue(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getPhone(),
                student.getRollNumber(),
                student.getParentEmail(),
                student.getClassEntity() != null ? student.getClassEntity().getId() : null,
                student.getClassEntity() != null ? student.getClassEntity().getClassName() : null,
                student.getClassEntity() != null ? student.getClassEntity().getSection() : null
        );
    }

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest req) {
        Student student = new Student();
        student.setName(req.getName());
        student.setEmail(req.getEmail());
        student.setPhone(req.getPhone());
        student.setParentEmail(req.getParentEmail());
        student.setRollNumber(req.getRollNumber());
        student.setPassword(passwordEncoder.encode(req.getPassword()));
        student.setActive(true);
        
        // ✅ FIX: Use Enum if Role is defined as Enum in Student entity
        student.setRole(User.Role.STUDENT); 

        ClassEntity classEntity = classRepository.findById(req.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));
        student.setClassEntity(classEntity);

        studentRepository.save(student);

        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getPhone(),
                student.getRollNumber(),
                student.getParentEmail(),
                classEntity.getId(),
                classEntity.getClassName(),
                classEntity.getSection()
        );
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long studentId, UpdateStudentRequest request) {
        Student student = studentRepository.findByIdAndActiveTrue(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setName(request.getName());
        student.setPhone(request.getPhone());
        student.setParentEmail(request.getParentEmail());
        student.setRollNumber(request.getRollNumber());
        student.setEmail(request.getEmail());

        if (request.getClassId() != null) {
            ClassEntity classEntity = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new RuntimeException("Class not found"));
            student.setClassEntity(classEntity);
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            student.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        studentRepository.save(student);

        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getPhone(),
                student.getRollNumber(),
                student.getParentEmail(),
                student.getClassEntity() != null ? student.getClassEntity().getId() : null,
                student.getClassEntity() != null ? student.getClassEntity().getClassName() : null,
                student.getClassEntity() != null ? student.getClassEntity().getSection() : null
        );
    }

    @Override
    @Transactional
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setActive(false); 
        studentRepository.save(student);
    }
    
    @Override
    public List<ClassEntity> getAllClasses() {
        return classRepository.findAll();
    }

    @Override
    @Transactional
    public ClassEntity createClass(ClassEntity classEntity) {
        return classRepository.save(classEntity);
    }

    @Override
    @Transactional
    public ClassEntity updateClass(Long classId, ClassEntity classEntity) {
        ClassEntity existing = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        existing.setClassName(classEntity.getClassName());
        existing.setSection(classEntity.getSection());
        existing.setAcademicYear(classEntity.getAcademicYear());
        existing.setSemester(classEntity.getSemester());

        return classRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteClass(Long classId) {
        classRepository.deleteById(classId);
    }

    private UserInfoResponse convertToUserInfoResponse(Teacher teacher) {
        UserInfoResponse response = new UserInfoResponse();
        response.setId(teacher.getId());
        response.setEmail(teacher.getEmail());
        response.setName(teacher.getName());
        response.setPhone(teacher.getPhone());
        if (teacher.getRole() != null) {
            response.setRole(teacher.getRole().toString());
        }
        response.setTeacherId(teacher.getTeacherId());
        response.setDepartment(teacher.getDepartment());
        return response;
    }

    private UserInfoResponse convertToUserInfoResponse(Student student) {
        UserInfoResponse response = new UserInfoResponse();
        response.setId(student.getId());
        response.setEmail(student.getEmail());
        response.setName(student.getName());
        response.setPhone(student.getPhone());
        if (student.getRole() != null) {
            response.setRole(student.getRole().toString());
        }
        response.setRollNumber(student.getRollNumber());
        response.setParentEmail(student.getParentEmail());

        if (student.getClassEntity() != null) {
            response.setClassInfo(new UserInfoResponse.ClassInfo(
                    student.getClassEntity().getId(),
                    student.getClassEntity().getClassName(),
                    student.getClassEntity().getSection(),
                    student.getClassEntity().getAcademicYear()
            ));
        }
        return response;
    }
}