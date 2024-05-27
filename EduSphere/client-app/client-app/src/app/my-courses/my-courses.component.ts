import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courses.service';
import { StudentService } from '../services/student.service';
import { AnsambleService } from '../services/ansamble.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit{
  courses: any[] = [];
  takenCourses: any[] = [];
  availableCourses: any[] = [];
  id: number = 0;
  student: any;
  professor: any;
  assistant: any;
  role: any;

  constructor(private courseService : CourseService, private studentService : StudentService, private router : Router, private ansambleService : AnsambleService) {}
  ngOnInit(): void {
    this.role = localStorage.getItem('role') || undefined;
    this.id = Number(localStorage.getItem('id'));
    this.courseService.getCourses().subscribe((res: any) => {
      this.courses = res;
    });
    if (this.role == 'Student') {
      this.studentService.getStudentById(this.id).subscribe((res: any) => {
        this.student = res;
      });
      this.courseService.getCoursesByStudent(this.id).subscribe((res: any) => {
        this.availableCourses = res;
      });
    } else if (this.role == 'Professor') {
      this.ansambleService.getProfessorById(this.id).subscribe((res: any) => {
        this.professor = res;
      });
      this.courseService.getCoursesByProfessor(this.id).subscribe((res: any) => {
        this.availableCourses = res;
      });
    } else if (this.role == 'Assistant') {
      this.ansambleService.getAssistantById(this.id).subscribe((res: any) => {
        this.professor = res;
      });
      this.courseService.getCoursesByAssistant(this.id).subscribe((res: any) => {
        this.availableCourses = res;
      });
    }
    this.availableCourses = this.courses.filter(course => !this.takenCourses.some(takenCourse => takenCourse.id === course.id));
  }

  viewCourse(id: number): void {
    this.router.navigate([`viewcourseinfo/${id}`]);
  }
}
