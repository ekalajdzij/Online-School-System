import { Component, OnInit } from '@angular/core';
import { AnsambleService } from '../services/ansamble.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Assistant } from '../models/assistant';

@Component({
  selector: 'app-add-assistant',
  templateUrl: './add-assistant.component.html',
  styleUrl: './add-assistant.component.css'
})
export class AddAssistantComponent implements OnInit {
  nameInputClicked: boolean = false; // Dodajemo varijablu za prvo input polje
  usernameInputClicked: boolean = false; // Dodajemo varijablu za drugo input polje
  passwordInputClicked: boolean = false; // Dodajemo varijablu za treće input polje
  mailInputClicked: boolean = false; // Dodajemo varijablu za select polje profesora
  studyYearInputClicked: boolean = false; // Dodajemo varijablu za select polje asistenta
  titleInputClicked: boolean = false; // Dodajemo varijablu za select polje asistenta
  assistant: any = {};
  assistantFormSubmitted: boolean = false;

  constructor(private dataService: DataService, private userService: UserService, private assistantService: AnsambleService, private router: Router) { }
  	
  ngOnInit(): void {
    
  }

  addAssistant() {
    this.assistantFormSubmitted = true; 
    if (this.assistant.name && this.assistant.username && this.assistant.password && this.assistant.mail && this.assistant.studyYear && this.assistant.Title) {
      this.assistant.isAssistant = true;
      this.assistant.isAdmin = false;
      this.assistant.isAssistant = false;
      this.assistant.isProfessor = false;
      this.userService.postUser(this.assistant).subscribe(data => {
        this.assistant = data;
        console.log(data);
      });
      this.dataService.setDataOption('Assistants');
      this.router.navigate(['/admin']);
    } else {
      alert("Please fill all the fields!");
    }
  } 
}
