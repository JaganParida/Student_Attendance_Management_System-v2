package com.attendance.system.dto.request;

import java.time.LocalDate;

public class UnlockRequestDTO {
    private Long courseId;
    private LocalDate date;
    private String reason;
    private String requestType;

    // ✅ Default Constructor (Required for @RequestBody serialization)
    public UnlockRequestDTO() {}

    // ✅ Constructor for convenience (Optional, but good to have)
    public UnlockRequestDTO(Long courseId, LocalDate date, String reason, String requestType) {
        this.courseId = courseId;
        this.date = date;
        this.reason = reason;
        this.requestType = requestType;
    }

    // ================= GETTERS AND SETTERS =================
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getRequestType() { return requestType; }
    public void setRequestType(String requestType) { this.requestType = requestType; }
}