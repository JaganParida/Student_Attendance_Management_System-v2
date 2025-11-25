package com.attendance.system.dto.response;

import java.time.LocalDate;

public class AttendanceReportResponse {
    private String className;
    private String courseName;
    private String teacherName;
    private LocalDate date;
    private int totalStudents;
    private int presentCount;
    private int absentCount;
    
    // ✅ FIX: Renamed from 'percentage' to 'attendancePercentage'
    // This matches what the Angular Frontend expects, fixing the NaN% error.
    private double attendancePercentage; 
    
    private String status;

    public AttendanceReportResponse() {
    }

    public AttendanceReportResponse(String className, String courseName, String teacherName, 
                                    LocalDate date, int totalStudents, int presentCount, 
                                    int absentCount, double attendancePercentage, String status) {
        this.className = className;
        this.courseName = courseName;
        this.teacherName = teacherName;
        this.date = date;
        this.totalStudents = totalStudents;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.attendancePercentage = attendancePercentage;
        this.status = status;
    }

    // ================= GETTERS AND SETTERS =================
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }

    public int getPresentCount() { return presentCount; }
    public void setPresentCount(int presentCount) { this.presentCount = presentCount; }

    public int getAbsentCount() { return absentCount; }
    public void setAbsentCount(int absentCount) { this.absentCount = absentCount; }

    // ✅ Updated Getter/Setter names
    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}