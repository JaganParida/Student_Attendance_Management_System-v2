package com.attendance.system.dto.response;

public class UserInfoResponse {
    private Long id;
    private String email;
    private String name;
    private String phone;
    private String role;
    
    // ✅ ADD THIS FIELD
    private String adminId;
    
    private String teacherId;
    private String department;
    private String rollNumber;
    private String parentEmail;
    private ClassInfo classInfo;

    public UserInfoResponse() {}

    public static class ClassInfo {
        private Long id;
        private String className;
        private String section;
        private String academicYear;

        public ClassInfo(Long id, String className, String section, String academicYear) {
            this.id = id;
            this.className = className;
            this.section = section;
            this.academicYear = academicYear;
        }
        
        public Long getId() { return id; }
        public String getClassName() { return className; }
        public String getSection() { return section; }
        public String getAcademicYear() { return academicYear; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // ✅ THIS SETTER FIXES THE ERROR
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }

    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }

    public ClassInfo getClassInfo() { return classInfo; }
    public void setClassInfo(ClassInfo classInfo) { this.classInfo = classInfo; }
}