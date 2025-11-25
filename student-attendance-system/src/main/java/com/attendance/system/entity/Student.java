package com.attendance.system.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "user_id") // Links to User table
public class Student extends User {
    
    @Column(name = "roll_number", unique = true)
    private String rollNumber;

    @Column(name = "parent_email")
    private String parentEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attendance> attendances = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LeaveRequest> leaveRequests = new ArrayList<>();

    // ✅ Default Constructor (Required by AdminServiceImpl when creating new Student())
    public Student() {
        super();
    }

    // ✅ Parameterized Constructor
    public Student(String email, String password, String name, String rollNumber, String parentEmail) {
        super(email, password, name, User.Role.STUDENT);
        this.rollNumber = rollNumber;
        this.parentEmail = parentEmail;
    }

    // --- MANUAL GETTERS AND SETTERS ---

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }

    public ClassEntity getClassEntity() { return classEntity; }
    public void setClassEntity(ClassEntity classEntity) { this.classEntity = classEntity; }

    public List<Attendance> getAttendances() { return attendances; }
    public void setAttendances(List<Attendance> attendances) { this.attendances = attendances; }

    public List<LeaveRequest> getLeaveRequests() { return leaveRequests; }
    public void setLeaveRequests(List<LeaveRequest> leaveRequests) { this.leaveRequests = leaveRequests; }
}