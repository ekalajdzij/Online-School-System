import { Component, OnInit } from '@angular/core';
import { AnsambleService } from '../services/ansamble.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-professor',
  templateUrl: './add-professor.component.html',
  styleUrls: ['./add-professor.component.css']
})
export class AddProfessorComponent implements OnInit {
  nameInputClicked: boolean = false;
  usernameInputClicked: boolean = false;
  passwordInputClicked: boolean = false;
  mailInputClicked: boolean = false;
  titleInputClicked: boolean = false;
  professor: any = {};
  professorFormSubmitted: boolean = false;

  constructor(private dataService: DataService, private userService: UserService, private professorService: AnsambleService, private router: Router) { }

  ngOnInit(): void {
    
  }

  addProfessor() {
    this.professorFormSubmitted = true; 
    if (this.professor.name && this.professor.username && this.professor.password && this.professor.mail && this.professor.title) {
      this.professor.isProfessor = true;
      this.professor.isAdmin = false;
      this.professor.isAssistant = false;
      this.professor.isStudent = false;
      this.userService.postUser(this.professor).subscribe(data => {
        this.professor = data;
        console.log(data);
      });
      this.dataService.setDataOption('Professors');
      this.router.navigate(['/admin']);
    } else {
      alert("Please fill all the fields!");
    }
  } 
}
