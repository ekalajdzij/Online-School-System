import { Component, OnInit } from '@angular/core';
import { AnsambleService } from '../services/ansamble.service';
import { CourseService } from '../services/courses.service';
import { Router } from '@angular/router';
import { Course } from '../models/course';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'] // Ispravite ovdje
})
export class AddCourseComponent implements OnInit {
  professors: any[] = [];
  assistants: any[] = [];
  course: any = {};
  courseFormSubmitted: boolean = false;
  nameInputClicked: boolean = false; // Dodajemo varijablu za prvo input polje
  overviewInputClicked: boolean = false; // Dodajemo varijablu za drugo input polje
  summaryInputClicked: boolean = false; // Dodajemo varijablu za treće input polje
  professorInputClicked: boolean = false; // Dodajemo varijablu za select polje profesora
  assistantInputClicked: boolean = false; // Dodajemo varijablu za select polje asistenta


  constructor(private ansambleService: AnsambleService, private courseService: CourseService, private router: Router) { }

  ngOnInit() {
    this.ansambleService.getProfessors().subscribe(data => {
      this.professors = data;
    });
    this.ansambleService.getAssistants().subscribe(data => {
      this.assistants = data;
    });
  }

  addCourse() {
    this.courseFormSubmitted = true; 
    if (this.course.name && this.course.overview && this.course.summary && this.course.professorId && this.course.assistantId) {

      this.courseService.postCourse(this.course).subscribe(data => {
        this.course = data;
        console.log(data);

      });
      this.router.navigate(['/admin']);
    } else {
      alert("Please fill all the fields!");
    }
  }  
}
