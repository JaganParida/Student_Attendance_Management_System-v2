package com.attendance.system.dto.response;

import java.util.List;

public class DashboardResponse {
    private long totalTeachers;
    private long totalStudents;
    private long totalClasses;
    private long totalCourses;
    
    // ✅ NEW: List to hold Recent Activity data
    private List<ActivityDTO> recentActivities;

    public DashboardResponse() {}

    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalClasses() { return totalClasses; }
    public void setTotalClasses(long totalClasses) { this.totalClasses = totalClasses; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    // ✅ Getters and Setters for Recent Activities
    public List<ActivityDTO> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; }
}