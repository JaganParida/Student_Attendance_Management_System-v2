package com.attendance.system.dto.response;

import java.time.LocalDateTime;

public class ActivityDTO {
    private String description;
    private String timeAgo;
    private String icon;        // e.g. "bi-person", "bi-file-text"
    private String statusColor; // e.g. "primary", "success", "warning"
    private LocalDateTime timestamp; // Used for sorting activities

    // ✅ Constructor used in AdminServiceImpl
    public ActivityDTO(String description, String timeAgo, String icon, String statusColor, LocalDateTime timestamp) {
        this.description = description;
        this.timeAgo = timeAgo;
        this.icon = icon;
        this.statusColor = statusColor;
        this.timestamp = timestamp;
    }

    // ================= GETTERS AND SETTERS =================
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTimeAgo() { return timeAgo; }
    public void setTimeAgo(String timeAgo) { this.timeAgo = timeAgo; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getStatusColor() { return statusColor; }
    public void setStatusColor(String statusColor) { this.statusColor = statusColor; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}