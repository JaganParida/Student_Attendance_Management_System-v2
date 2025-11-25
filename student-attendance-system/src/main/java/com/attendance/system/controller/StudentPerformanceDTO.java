package com.attendance.system.controller;

public class StudentPerformanceDTO {
    private Long studentId;
    private String studentName;
    private double attendancePercentage;
    private int totalClasses;
    private int classesAttended;

    public StudentPerformanceDTO(Long studentId, String studentName, double attendancePercentage, int totalClasses, int classesAttended) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.attendancePercentage = attendancePercentage;
        this.totalClasses = totalClasses;
        this.classesAttended = classesAttended;
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

    public int getClassesAttended() { return classesAttended; }
    public void setClassesAttended(int classesAttended) { this.classesAttended = classesAttended; }
}