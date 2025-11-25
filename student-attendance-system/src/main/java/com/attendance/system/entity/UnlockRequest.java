package com.attendance.system.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "unlock_requests")
public class UnlockRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the Teacher who made the request
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonIgnoreProperties({"unlockRequests", "courses", "password", "role"}) // Prevent recursion
    private Teacher teacher;

    // Link to the Course to be unlocked
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"unlockRequests", "students", "teacher"}) // Prevent recursion
    private Course course;

    // This can be NULL for general unlocks
    @Column(name = "attendance_id")
    private Long attendanceId; 

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate; 

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    private Status status; // PENDING, APPROVED, REJECTED

    @Column(name = "request_type")
    private String requestType; // LATE_MARKING, EDIT_UNLOCK

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = Status.PENDING;
    }

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
    
    // ==========================================
    // MANUAL GETTERS AND SETTERS (No Lombok)
    // ==========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Long getAttendanceId() { return attendanceId; }
    public void setAttendanceId(Long attendanceId) { this.attendanceId = attendanceId; }

    public LocalDate getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDate requestDate) { this.requestDate = requestDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}