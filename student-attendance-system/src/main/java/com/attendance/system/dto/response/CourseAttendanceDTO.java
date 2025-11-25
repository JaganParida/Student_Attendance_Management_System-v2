package com.attendance.system.dto.response;

public class CourseAttendanceDTO {
    private Long courseId;
    private String courseName;
    private String courseCode;
    private int totalClasses;
    private int attendedClasses; // Present count
    private double percentage;

    public CourseAttendanceDTO(Long courseId, String courseName, String courseCode, int totalClasses, int attendedClasses, double percentage) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.totalClasses = totalClasses;
        this.attendedClasses = attendedClasses;
        this.percentage = percentage;
    }

    // Getters and Setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }
    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }
    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}