package com.attendance.system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "teachers")
@PrimaryKeyJoinColumn(name = "user_id") // Links to the User table
public class Teacher extends User {

    // "Employee ID" (e.g., T-101), distinct from the database ID
    @Column(name = "teacher_emp_id")
    private String teacherId; 

    private String department;

    // ✅ Default Constructor (Required by JPA)
    public Teacher() {
        super();
    }

    // ✅ THIS CONSTRUCTOR WAS MISSING
    // It matches: new Teacher(email, password, name, teacherId)
    public Teacher(String email, String password, String name, String teacherId) {
        super(email, password, name, User.Role.TEACHER);
        this.teacherId = teacherId;
    }

    // --- MANUAL GETTERS AND SETTERS ---

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}