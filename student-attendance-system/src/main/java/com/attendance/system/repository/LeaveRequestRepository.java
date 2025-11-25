package com.attendance.system.repository;

import com.attendance.system.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    // For Student: View their own requests
    List<LeaveRequest> findByStudentIdOrderByRequestedAtDesc(Long studentId);

    // For Teacher: View PENDING requests
    List<LeaveRequest> findByTeacherIdAndStatus(Long teacherId, LeaveRequest.Status status);

    // ✅ NEW: For Teacher History (Approved OR Rejected), ordered by Processed Date
    List<LeaveRequest> findByTeacherIdAndStatusInOrderByProcessedAtDesc(Long teacherId, Collection<LeaveRequest.Status> statuses);

    // For Dashboard Counts
    long countByTeacherIdAndStatus(Long teacherId, LeaveRequest.Status status);
}