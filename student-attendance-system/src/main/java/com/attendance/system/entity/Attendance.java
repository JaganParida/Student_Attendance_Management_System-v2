package com.attendance.system.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "marked_at")
    private LocalDateTime markedAt;

    @Column(name = "marked_by")
    private String markedBy;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    // 🔴 NEW FIELDS FOR UNLOCKING MECHANISM
    
    // Tracks if the record is locked for editing (Default: TRUE)
    @Column(name = "is_locked", nullable = false)
    private boolean isLocked = true; 

    // Tracks which Admin approved the unlock (Optional)
    @Column(name = "unlock_approved_by")
    private Long unlockApprovedBy; 

    public enum Status {
        PRESENT,
        ABSENT,
        LATE
    }

    public Attendance() {}

    public Attendance(Student student, Course course, LocalDate date, Status status) {
        this.student = student;
        this.course = course;
        this.date = date;
        this.status = status;
    }

    // ================= GETTERS AND SETTERS =================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getMarkedAt() { return markedAt; }
    public void setMarkedAt(LocalDateTime markedAt) { this.markedAt = markedAt; }

    public String getMarkedBy() { return markedBy; }
    public void setMarkedBy(String markedBy) { this.markedBy = markedBy; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    // 🔴 NEW GETTERS AND SETTERS
    public boolean getIsLocked() { return isLocked; }
    public void setIsLocked(boolean isLocked) { this.isLocked = isLocked; }

    public Long getUnlockApprovedBy() { return unlockApprovedBy; }
    public void setUnlockApprovedBy(Long unlockApprovedBy) { this.unlockApprovedBy = unlockApprovedBy; }
}