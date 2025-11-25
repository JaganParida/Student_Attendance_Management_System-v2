package com.attendance.system.dto.response;

public class StudentPerformanceDTO {
    private Long studentId;
    private String studentName;
    private double attendancePercentage;
    private int totalClasses;
    private int presentClasses;

    public StudentPerformanceDTO(Long studentId, String studentName, double attendancePercentage, int totalClasses, int presentClasses) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.attendancePercentage = attendancePercentage;
        this.totalClasses = totalClasses;
        this.presentClasses = presentClasses;
    }

    // Getters and Setters
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }
    public int getPresentClasses() { return presentClasses; }
    public void setPresentClasses(int presentClasses) { this.presentClasses = presentClasses; }
}