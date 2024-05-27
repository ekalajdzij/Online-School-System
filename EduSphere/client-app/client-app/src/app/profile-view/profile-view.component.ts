import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { AnsambleService } from '../services/ansamble.service';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit {
  id: number = 0;
  user: any;
  role: any;
  editUsername: string = '';
  editPassword: string = '';
  studyYear : any;
  title : any;
  

  constructor(private studentService : StudentService, private ansambleService : AnsambleService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || undefined;
    this.id = Number(localStorage.getItem('id'));
    console.log("id dobijen u profile komp je " + this.id);
    console.log("rola dobijen u profile komp je " + this.role);
    if (this.role == 'Student') {    
      this.studentService.getStudentById(this.id).subscribe((res: any) => {
        console.log("dobio studenta" + res.username)
        this.user = res;
        this.studyYear = res.studyYear;
      });
    } if (this.role == 'Professor') {
        this.ansambleService.getProfessorById(this.id).subscribe((res: any) => {
          this.user = res;
          this.title = res.title;
        });
    } if (this.role == 'Assistant') {
        this.ansambleService.getAssistantById(this.id).subscribe((res: any) => {
          this.user = res;
          this.studyYear = res.studyYear;
          this.title = res.title;
        });
    }
  }

  saveChanges(): void {
    if (this.editUsername) {
      this.user.username = this.editUsername;
    }
    if (this.editPassword) {
      this.user.password = this.editPassword;
    }
    if (this.role == 'Student') {
      this.studentService.updateStudentProfile(this.id, this.user).subscribe((res: any) => {
        this.user = res;
        this.editUsername = '';
        this.editPassword = '';
      });
    } else if (this.role == 'Professor') {
      this.ansambleService.updateProfessor(this.id, this.user).subscribe((res: any) => {
        this.user = res;
        this.editUsername = '';
        this.editPassword = '';
      });
    } else if (this.role == 'Assistant') {
      this.ansambleService.updateAssistant(this.id, this.user).subscribe((res: any) => {
        this.user = res;
        this.editUsername = '';
        this.editPassword = '';
      });
    }
  }

}
