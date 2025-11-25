package com.attendance.system.repository;

import com.attendance.system.entity.Student;
import com.attendance.system.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // --- 1. Authentication & Lookup ---
    Optional<Student> findByEmail(String email);
    
    Optional<Student> findByRollNumber(String rollNumber);
    
    Boolean existsByRollNumber(String rollNumber);

    // --- 2. Active Status Checks ---
    Optional<Student> findByIdAndActiveTrue(Long id);
    
    List<Student> findByActiveTrue();
    
    Long countByActiveTrue();

    // --- 3. Class Based Fetching ---
    
    // Finds all students in a class object
    List<Student> findByClassEntity(ClassEntity classEntity);

    // ✅ ADDED: This is the specific method needed for the TeacherService optimization
    // It fetches students by the Class ID directly
    List<Student> findByClassEntityId(Long classId);

    // Finds active students by Class ID (Useful if you want to hide inactive students)
    List<Student> findByClassEntityIdAndActiveTrue(Long classId);
    
    // --- 4. Teacher Dashboard Statistic ---
    
    // ✅ FIXED QUERY: 
    // We cannot JOIN Student and Course directly because they are not related in the Entity.
    // Instead, we find Students whose Class ID matches the Class IDs of the Teacher's Courses.
    @Query("SELECT COUNT(DISTINCT s) FROM Student s " +
           "WHERE s.classEntity.id IN (" +
           "    SELECT c.classEntity.id FROM Course c WHERE c.teacher.id = :teacherId" +
           ") AND s.active = true")
    long countStudentsByTeacherId(@Param("teacherId") Long teacherId);
}