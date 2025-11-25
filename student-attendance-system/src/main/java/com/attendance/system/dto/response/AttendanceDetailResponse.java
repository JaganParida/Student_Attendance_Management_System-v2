package com.attendance.system.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceDetailResponse {
    private Long id;
    private LocalDate date;
    private String status;
    private String courseName;
    private String courseCode;
    private LocalTime startTime;
    private LocalTime endTime;

    // ✅ Constructor matching StudentServiceImpl
    public AttendanceDetailResponse(Long id, LocalDate date, String status, String courseName, String courseCode, LocalTime startTime, LocalTime endTime) {
        this.id = id;
        this.date = date;
        this.status = status;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    // Getters/Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}