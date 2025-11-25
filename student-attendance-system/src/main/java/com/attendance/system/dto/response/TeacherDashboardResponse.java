package com.attendance.system.dto.response;

import java.util.List;

public class TeacherDashboardResponse {
    private long totalCourses;
    private long totalStudents;
    private long attendanceMarkedToday;
    private long pendingUnlockRequests;
    private long pendingLeaveRequests;
    
    // ✅ This list holds the schedule data for the frontend
    private List<TodayClassDTO> todayClasses;

    public TeacherDashboardResponse() {}

    // ✅ Constructor matching the exact order in TeacherServiceImpl
    public TeacherDashboardResponse(long totalCourses, long totalStudents, 
                                    long attendanceMarkedToday, long pendingUnlockRequests, 
                                    long pendingLeaveRequests, 
                                    List<TodayClassDTO> todayClasses) {
        this.totalCourses = totalCourses;
        this.totalStudents = totalStudents;
        this.attendanceMarkedToday = attendanceMarkedToday;
        this.pendingUnlockRequests = pendingUnlockRequests;
        this.pendingLeaveRequests = pendingLeaveRequests;
        this.todayClasses = todayClasses;
    }

    // ================= GETTERS AND SETTERS =================
    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getAttendanceMarkedToday() { return attendanceMarkedToday; }
    public void setAttendanceMarkedToday(long attendanceMarkedToday) { this.attendanceMarkedToday = attendanceMarkedToday; }

    public long getPendingUnlockRequests() { return pendingUnlockRequests; }
    public void setPendingUnlockRequests(long pendingUnlockRequests) { this.pendingUnlockRequests = pendingUnlockRequests; }

    public long getPendingLeaveRequests() { return pendingLeaveRequests; }
    public void setPendingLeaveRequests(long pendingLeaveRequests) { this.pendingLeaveRequests = pendingLeaveRequests; }

    public List<TodayClassDTO> getTodayClasses() { return todayClasses; }
    public void setTodayClasses(List<TodayClassDTO> todayClasses) { this.todayClasses = todayClasses; }
}