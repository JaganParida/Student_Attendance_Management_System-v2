package com.attendance.system.dto.response;

// This DTO is safe to return from the API (no loops)
public class ClassResponseDTO {
    private Long classId;
    private String className;
    private String section;
    private String academicYear;
    private String semester;
    
    // --- (Removed teacher/course fields) ---

    // --- Getters and Setters ---
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}