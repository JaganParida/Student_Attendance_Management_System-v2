package com.attendance.system.dto.request;

import java.util.List;

public class CourseRequestDTO {
    private String courseName;
    private String courseCode;
    private String startTime;
    private String endTime;
    private Long teacherId;
    private Long classId;
    
    // ✅ NEW: List of Student IDs to assign
    private List<Long> studentIds;

    public CourseRequestDTO() {}

    // --- Getters and Setters ---
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }

    public List<Long> getStudentIds() { return studentIds; }
    public void setStudentIds(List<Long> studentIds) { this.studentIds = studentIds; }
}