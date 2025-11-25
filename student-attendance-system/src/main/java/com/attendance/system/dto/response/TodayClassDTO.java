package com.attendance.system.dto.response;

import java.time.LocalTime;

public class TodayClassDTO {
    private Long id;
    private String courseName; 
    private String courseCode; 
    private LocalTime startTime;
    private LocalTime endTime;
    private String classRoom;
    private String className;  
    private String section;   
    private String status;     

    // 🔴 Logic Flags
    private boolean isUnlockedByAdmin; 
    private boolean hasPendingRequest; 
    private boolean isAttendanceMarked; // Crucial for toggling Mark/Update

    public TodayClassDTO(Long id, String courseName, String courseCode, 
                         LocalTime startTime, LocalTime endTime, 
                         String classRoom, String semester, String section) {
        this.id = id;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.classRoom = classRoom;
        this.className = (semester != null) ? "Sem " + semester : "General"; 
        this.section = section;
        this.status = "Scheduled"; 
    }

    // ================= GETTERS AND SETTERS =================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    
    public String getClassRoom() { return classRoom; }
    public void setClassRoom(String classRoom) { this.classRoom = classRoom; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean getIsUnlockedByAdmin() { return isUnlockedByAdmin; }
    public void setIsUnlockedByAdmin(boolean isUnlockedByAdmin) { this.isUnlockedByAdmin = isUnlockedByAdmin; }

    public boolean isHasPendingRequest() { return hasPendingRequest; }
    public void setHasPendingRequest(boolean hasPendingRequest) { this.hasPendingRequest = hasPendingRequest; }

    public boolean getIsAttendanceMarked() { return isAttendanceMarked; }
    public void setIsAttendanceMarked(boolean isAttendanceMarked) { this.isAttendanceMarked = isAttendanceMarked; }
}