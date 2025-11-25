package com.attendance.system.dto.response;

import java.util.List;

public class StudentDashboardResponse {
    private String studentName;
    private String rollNumber;
    private String semester;
    private String academicYear;
    private double overallAttendance;
    
    private List<CourseAttendanceDTO> courseAttendances;

    public StudentDashboardResponse() {}

    // Getters and Setters
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public double getOverallAttendance() { return overallAttendance; }
    public void setOverallAttendance(double overallAttendance) { this.overallAttendance = overallAttendance; }

    public List<CourseAttendanceDTO> getCourseAttendances() { return courseAttendances; }
    public void setCourseAttendances(List<CourseAttendanceDTO> courseAttendances) { this.courseAttendances = courseAttendances; }
}