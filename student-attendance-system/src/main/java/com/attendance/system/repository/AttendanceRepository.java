package com.attendance.system.repository;

import com.attendance.system.entity.Attendance;
import com.attendance.system.entity.Course;
import com.attendance.system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // ================= STUDENT DASHBOARD HELPERS =================
    
    // 🔴 CRITICAL: Get all courses the student has ever attended (for history)
    @Query("SELECT DISTINCT a.course FROM Attendance a WHERE a.student.id = :studentId")
    List<Course> findCoursesByStudentId(@Param("studentId") Long studentId);

    // ================= EXISTING METHODS =================
    List<Attendance> findByCourseAndDate(Course course, LocalDate date);
    boolean existsByCourseAndDate(Course course, LocalDate date);

    @Query("SELECT a.isLocked FROM Attendance a WHERE a.course.id = :courseId AND a.date = :date")
    List<Boolean> findIsLockedStatusByCourseIdAndDate(@Param("courseId") Long courseId, @Param("date") LocalDate date);
    
    long countByTeacherIdAndDate(Long teacherId, LocalDate date);
    long countByCourseIdAndStudentId(Long courseId, Long studentId);
    long countByCourseIdAndStudentIdAndStatus(Long courseId, Long studentId, Attendance.Status status);
    List<Attendance> findTop5ByOrderByMarkedAtDesc();

    // Student Module Specifics
    List<Attendance> findByStudentAndCourse(Student student, Course course);
    List<Attendance> findByStudentAndDateBetween(Student student, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student AND a.course = :course AND a.status = 'PRESENT'")
    long countPresentByStudentAndCourse(@Param("student") Student student, @Param("course") Course course);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student AND a.course = :course")
    long countTotalByStudentAndCourse(@Param("student") Student student, @Param("course") Course course);
}