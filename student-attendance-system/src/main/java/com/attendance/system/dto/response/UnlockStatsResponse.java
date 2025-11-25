package com.attendance.system.dto.response;

public class UnlockStatsResponse {
    private long total;
    private long pending;
    private long approved;
    private long rejected;

    public UnlockStatsResponse(long total, long pending, long approved, long rejected) {
        this.total = total;
        this.pending = pending;
        this.approved = approved;
        this.rejected = rejected;
    }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }

    public long getApproved() { return approved; }
    public void setApproved(long approved) { this.approved = approved; }

    public long getRejected() { return rejected; }
    public void setRejected(long rejected) { this.rejected = rejected; }
}