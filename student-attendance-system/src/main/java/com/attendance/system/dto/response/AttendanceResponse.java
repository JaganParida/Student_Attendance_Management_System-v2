package com.attendance.system.dto.response;

import com.attendance.system.entity.Attendance;

public class AttendanceResponse {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Attendance.Status status;

    public AttendanceResponse() {}

    // ✅ MATCHING CONSTRUCTOR
    public AttendanceResponse(Long studentId, String studentName, String rollNumber, Attendance.Status status) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.status = status;
    }

    // Getters and Setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public Attendance.Status getStatus() { return status; }
    public void setStatus(Attendance.Status status) { this.status = status; }
}