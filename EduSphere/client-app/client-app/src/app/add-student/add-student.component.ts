import { Component, OnInit } from '@angular/core';
import { AnsambleService } from '../services/ansamble.service';
import { UserService } from '../services/user.service';
import { StudentService } from '../services/student.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Student } from '../models/student';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent implements OnInit {
  nameInputClicked: boolean = false; // Dodajemo varijablu za prvo input polje
  usernameInputClicked: boolean = false; // Dodajemo varijablu za drugo input polje
  passwordInputClicked: boolean = false; // Dodajemo varijablu za treće input polje
  mailInputClicked: boolean = false; // Dodajemo varijablu za select polje profesora
  studyYearInputClicked: boolean = false; // Dodajemo varijablu za select polje asistenta
  student: any = {};
  studentFormSubmitted: boolean = false;

  constructor(private dataService: DataService, private userService: UserService, private studentService: StudentService, private router: Router) { }
  	
  ngOnInit(): void {
    
  }

  addStudent() {
    this.studentFormSubmitted = true; 
    if (this.student.name && this.student.username && this.student.password && this.student.mail && this.student.studyYear) {
      this.student.isStudent = true;
      this.student.isAdmin = false;
      this.student.isAssistant = false;
      this.student.isProfessor = false;
      this.userService.postUser(this.student).subscribe(data => {
        this.student = data;
        console.log(data);
      });
      this.dataService.setDataOption('Students');
      this.router.navigate(['/admin']);
    } else {
      alert("Please fill all the fields!");
    }
  } 
}
