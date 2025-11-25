package com.attendance.system.dto.response;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class CourseResponse {
    private Long id;
    private String courseCode;
    private String courseName;
    private String shortName;
    private String description;
    private Long teacherId;
    private String teacherName;
    private Long classId;
    private String className;
    private String section;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String classRoom;

    public CourseResponse() {}

    // ✅ MATCHING CONSTRUCTOR
    public CourseResponse(Long id, String courseCode, String courseName, String shortName, 
                          String description, Long teacherId, String teacherName, 
                          Long classId, String className, String section, 
                          DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, 
                          String classRoom) {
        this.id = id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.shortName = shortName;
        this.description = description;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.classId = classId;
        this.className = className;
        this.section = section;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.classRoom = classRoom;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }
    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getClassRoom() { return classRoom; }
    public void setClassRoom(String classRoom) { this.classRoom = classRoom; }
}