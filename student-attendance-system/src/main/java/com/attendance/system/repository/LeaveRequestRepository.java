package com.attendance.system.repository;

import com.attendance.system.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    List<LeaveRequest> findByStudentId(Long studentId);

    // ✅ Used for Teacher Dashboard List
    List<LeaveRequest> findByTeacherIdAndStatus(Long teacherId, LeaveRequest.Status status);

    // ✅ ADDED: Used for Teacher Dashboard Counters (Fixes your error)
    long countByTeacherIdAndStatus(Long teacherId, LeaveRequest.Status status);
}