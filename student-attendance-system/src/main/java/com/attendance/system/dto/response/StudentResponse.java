package com.attendance.system.dto.response;

public class StudentResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String rollNumber;
    private String parentEmail;
    private Long classId;
    private String className;
    private String section;

    public StudentResponse() {}

    // ✅ THE MISSING CONSTRUCTOR
    public StudentResponse(Long id, String name, String email, String phone, 
                           String rollNumber, String parentEmail, 
                           Long classId, String className, String section) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.rollNumber = rollNumber;
        this.parentEmail = parentEmail;
        this.classId = classId;
        this.className = className;
        this.section = section;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
}