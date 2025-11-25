package com.attendance.system.repository;

import com.attendance.system.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    
    Optional<Teacher> findByTeacherId(String teacherId);
    
    List<Teacher> findByActiveTrue();
    
    Long countByActiveTrue();
    
    Optional<Teacher> findByIdAndActiveTrue(Long id);
    
    // --- THIS IS THE FIX ---
    // Add this method so your TeacherController can find the user by their email
    Optional<Teacher> findByEmail(String email);
}