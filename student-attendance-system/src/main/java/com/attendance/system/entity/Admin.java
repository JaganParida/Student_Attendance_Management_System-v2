package com.attendance.system.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "admins")
@PrimaryKeyJoinColumn(name = "user_id")
public class Admin extends User {

    @Column(name = "admin_id", unique = true)
    private String adminId;

    public Admin() {
        super();
    }

    // ✅ THIS CONSTRUCTOR IS REQUIRED
    public Admin(String email, String password, String name) {
        super(email, password, name, User.Role.ADMIN);
    }

    // ✅ THIS GETTER IS REQUIRED
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }
}