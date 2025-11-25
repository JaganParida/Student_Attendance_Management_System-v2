import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html',
})
export class StudentListComponent implements OnInit {
  courses: any[] = [];
  students: any[] = [];
  selectedCourseId: number | null = null;

  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.teacherService
      .getTeacherCourses()
      .subscribe((data) => (this.courses = data));
  }

  loadStudents() {
    if (this.selectedCourseId) {
      this.teacherService
        .getStudentsByCourse(this.selectedCourseId)
        .subscribe((data) => (this.students = data));
    }
  }
}
