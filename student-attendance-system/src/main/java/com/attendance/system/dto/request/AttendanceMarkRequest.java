package com.attendance.system.dto.request;

import com.attendance.system.entity.Attendance;
import java.time.LocalDate;
import java.util.List;

public class AttendanceMarkRequest {
    private Long courseId;
    private LocalDate date;
    private boolean notifyParents;
    private List<StudentAttendance> attendanceList;

    // Static Inner Class for the list items
    public static class StudentAttendance {
        private Long studentId;
        private Attendance.Status status;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public Attendance.Status getStatus() { return status; }
        public void setStatus(Attendance.Status status) { this.status = status; }
    }

    // Getters and Setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isNotifyParents() { return notifyParents; }
    public void setNotifyParents(boolean notifyParents) { this.notifyParents = notifyParents; }

    public List<StudentAttendance> getAttendanceList() { return attendanceList; }
    public void setAttendanceList(List<StudentAttendance> attendanceList) { this.attendanceList = attendanceList; }
}