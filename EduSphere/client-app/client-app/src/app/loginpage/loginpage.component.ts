import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  loginForm! : FormGroup;
  

  constructor(private loginService: AuthService, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ])
    });
  }

  navigateToHome(): void {
    this.router.navigate(['']);
  }


  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const data = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.loginService.postLogin(data).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.dataService.setData(res.id);
      
        if (this.loginService.getRoles() === 'Student') {
          this.router.navigate(['student']);
        } 
        else if (this.loginService.getRoles() === 'Professor' || this.loginService.getRoles() === 'Assistant') {
          this.router.navigate(['ansamble']);
        } 
        else if (this.loginService.getRoles() === 'Admin') {
          this.router.navigate(['admin']);
        }
      },
      (error: any) => {
        let errorMessage = 'Unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `${error.error.message}`;
      } 
      else if (error.status && error.message) {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      } 
      else if (error.error && error.error.message) {
        errorMessage = `${error.error.message}`;
      } 
      else if (error.message) {
        errorMessage = `${error.message}`;
      }

        alert(errorMessage);
        }
      );
    }
}
