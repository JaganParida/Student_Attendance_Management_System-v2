package com.attendance.system.dto.request;

import java.time.LocalDate;

public class LeaveRequestDTO {
    // ✅ ADDED: This was missing and causing the error in the Service
    private Long courseId;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String type; 

    // ================= GETTERS AND SETTERS =================
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}