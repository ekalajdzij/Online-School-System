import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courses.service';
import { StudentService } from '../services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-courses-view',
  templateUrl: './all-courses-view.component.html',
  styleUrl: './all-courses-view.component.css'
})
export class AllCoursesViewComponent implements OnInit{
  courses: any[] = [];
  takenCourses: any[] = [];
  availableCourses: any[] = [];
  id: number = 0;
  student: any;

  constructor(private courseService : CourseService, private studentService : StudentService, private router : Router) {}
  ngOnInit(): void {
    this.id = Number(localStorage.getItem('id'));
    this.courseService.getCourses().subscribe((res: any) => {
      this.courses = res;
    });
    this.studentService.getStudentById(this.id).subscribe((res: any) => {
      this.student = res;
    });
    this.courseService.getCoursesByStudent(this.id).subscribe((res: any) => {
      this.availableCourses = res;
    });
    this.availableCourses = this.courses.filter(course => !this.takenCourses.some(takenCourse => takenCourse.id === course.id));
  }

  viewCourse(id: number): void {
    this.router.navigate([`viewcourseinfo/${id}`]);
  }
}
