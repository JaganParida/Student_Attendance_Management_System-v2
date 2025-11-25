package com.attendance.system.dto.response;

public class StudentSummaryDTO {
    private Long id;
    private String name;
    private String rollNumber;
    private String email;

    public StudentSummaryDTO() {}

    // ✅ MATCHING CONSTRUCTOR
    public StudentSummaryDTO(Long id, String name, String rollNumber, String email) {
        this.id = id;
        this.name = name;
        this.rollNumber = rollNumber;
        this.email = email;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}