package com.attendance.system.dto.request;

import java.time.LocalDate;

public class LeaveRequestDTO {
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    
    // ✅ ADDED: Missing field
    private String type; 

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    // ✅ ADDED: Missing Getter/Setter
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}