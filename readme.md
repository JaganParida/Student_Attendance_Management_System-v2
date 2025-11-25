# 📚 Student Attendance Management System

> A comprehensive web-based solution for managing academic attendance with strict time-window constraints, role-based access control, and automated parent notifications.

![Project Status](https://img.shields.io/badge/status-active-success.svg)

## 📖 Overview

The **Student Attendance Management System** is designed to streamline the tracking of student participation while enforcing institutional discipline through time-bound actions. It features a secure JWT-based authentication system and distinct dashboards for **Admins**, **Teachers**, and **Students**.

Key differentiators include a strict **15-minute window** for marking attendance, a **2-day expiry** for edits, and an **Admin Unlock Protocol** for actions outside these windows.

---

## 🚀 Key Features

### 🛡️ For Admins
* **Master Dashboard:** Overview of total students, teachers, and active courses.
* **Unlock Request Management (Core Logic):**
  * View a list of "Unlock Requests" from teachers who missed the 15-minute marking window or the 2-day editing window.
  * Action: **Approve** (temporarily opens the window for the teacher) or **Reject** requests.
* **User Management:** Add, update, or remove Student and Teacher profiles.
* **Academic Configuration:**
  * Create Courses/Subjects.
  * Assign Subjects to specific Teachers.
  * Map Students to Courses.
* **Reports:** Generate system-wide attendance reports.

### 👨‍🏫 For Teachers
* **Secure Access:** JWT-secured login and profile management.
* **Smart Dashboard:** View today's scheduled classes at a glance.
* **Time-Bound Attendance:** Mark attendance only within **15 minutes** of the class start time.
* **Absentee Management:**
  * Smart popup detection: If students are marked absent, the system prompts to send email alerts.
  * Options: *Send Email to Parents* or *Submit Without Email*.
* **Correction Window:** Edit attendance records within **2 days** of the class date.
* **Unlock Requests:** Automated workflow to request Admin approval if marking/editing is attempted outside allowed time limits.
* **Request Management:** Review and Approve/Reject student leave applications and attendance correction requests.
* **Analytics:** View student lists and performance metrics per subject.

### 👨‍🎓 For Students
* **Performance Dashboard:**
  * Real-time attendance table (Course Name, Code, Attended/Delivered).
  * Visual highlights for low attendance.
  * **Total Aggregate Percentage** calculated automatically at the bottom.
* **Filters:** View data by Academic Year and Semester.
* **Detailed Views:** Drill down into daily attendance logs for specific subjects.
* **Resource Hub:** Download study materials uploaded by teachers.
* **Dispute Resolution:** Request attendance corrections or leave (with reason & proof upload).
* **Status Tracking:** Monitor the status of requests (Pending/Approved/Rejected).

---

## ⚙️ Core Business Logic & Rules

This system enforces specific business rules to ensure data integrity:

### 1. The 15-Minute Rule ⏳
Teachers are strictly limited to marking attendance within **15 minutes** of the scheduled class start time.
* *Scenario:* Class starts at 10:00 AM.
* *Action:* Attendance opens at 10:00 AM and locks at 10:15 AM.
* *Exception:* Teacher must request an **Admin Unlock** to mark it after 10:15 AM.

### 2. The 2-Day Editing Window 🗓️
Modifications to attendance records are only permitted within **48 hours** (2 days) of the class date.
* *Scenario:* Attendance marked on Monday.
* *Action:* Edits allowed until Wednesday.
* *Exception:* Teacher must request an **Admin Unlock** to edit after Wednesday.

### 3. Parent Notification Protocol 📧
When submitting attendance with absentees, the system interrupts the workflow to offer an optional parent notification trigger via email.

---

## 🛠️ Tech Stack

* **Frontend:** Angular / HTML5 / CSS3
* **Backend:** Java Spring Boot
* **Database:** MySQL
* **Authentication:** JSON Web Tokens (JWT)
* **Email Service:** JavaMailSender

---

## 🏗️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/JaganParida/Student_Attendance_Management_System-v2.git](https://github.com/JaganParida/Student_Attendance_Management_System-v2.git)