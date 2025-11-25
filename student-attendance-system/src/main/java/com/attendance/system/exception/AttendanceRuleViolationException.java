package com.attendance.system.exception;

public class AttendanceRuleViolationException extends RuntimeException {
    public AttendanceRuleViolationException(String message) {
        super(message);
    }
}
