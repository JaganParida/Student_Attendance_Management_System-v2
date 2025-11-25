package com.attendance.system.repository;

import com.attendance.system.entity.UnlockRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UnlockRequestRepository extends JpaRepository<UnlockRequest, Long> {

    // ================= FOR ADMIN =================
    List<UnlockRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(UnlockRequest.Status status);
    List<UnlockRequest> findByStatus(UnlockRequest.Status status);

    @Query("SELECT r FROM UnlockRequest r JOIN FETCH r.course WHERE r.id = :id")
    Optional<UnlockRequest> findByIdWithCourse(@Param("id") Long id);

    // ================= FOR TEACHER =================
    List<UnlockRequest> findByTeacherId(Long teacherId);
    long countByTeacherIdAndStatus(Long teacherId, UnlockRequest.Status status);

    // 🔴 NEW METHOD: Find requests for a specific session to determine Pending/Approved status on Dashboard
    @Query("SELECT r FROM UnlockRequest r WHERE r.course.id = :courseId AND r.requestDate = :date")
    List<UnlockRequest> findByCourseIdAndDate(@Param("courseId") Long courseId, @Param("date") LocalDate date);
}