package com.attendance.system.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ClassRequestDTO {

    @NotBlank(message = "Class name cannot be blank")
    private String className;

    @NotBlank(message = "Section cannot be blank")
    private String section;

    @NotBlank(message = "Academic year cannot be blank")
    private String academicYear;

    private String semester;
    
    // --- Getters and Setters ---
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}