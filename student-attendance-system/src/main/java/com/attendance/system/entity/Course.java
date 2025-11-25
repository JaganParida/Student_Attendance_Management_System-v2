package com.attendance.system.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private String courseCode;
    
    private String shortName;
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week") 
    private DayOfWeek dayOfWeek;
    
    private String classRoom;
    private LocalTime startTime;
    private LocalTime endTime;
    
    // ✅ FIX 1: Initialize to TRUE by default. 
    // This solves the "Admin created course but it's hidden" issue.
    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.EAGER) // Changed to EAGER to prevent LazyInit exceptions in simple queries
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @ManyToMany
    @JoinTable(
        name = "course_students",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @JsonIgnore // ✅ FIX 2: Prevents "StackOverflow" crash when converting to JSON
    private Set<Student> students = new HashSet<>();

    // ✅ FIX 3: Safety Check before saving to Database
    @PrePersist
    protected void onCreate() {
        // Ensure the student list is never null
        if (this.students == null) {
            this.students = new HashSet<>();
        }
        // Note: We rely on the 'private boolean active = true' initialization above
    }

    // ==========================================
    // MANUAL GETTERS AND SETTERS
    // ==========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getClassRoom() { return classRoom; }
    public void setClassRoom(String classRoom) { this.classRoom = classRoom; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public ClassEntity getClassEntity() { return classEntity; }
    public void setClassEntity(ClassEntity classEntity) { this.classEntity = classEntity; }

    public Set<Student> getStudents() { return students; }
    public void setStudents(Set<Student> students) { this.students = students; }
}