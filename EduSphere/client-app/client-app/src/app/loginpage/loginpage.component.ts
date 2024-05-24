import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent implements OnInit {
  loginForm! : FormGroup;

  constructor(private loginService: LoginService, private router: Router) {}

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

  

onSubmit(): void {
  if (this.loginForm.invalid) return;

  const data = {
    username: this.loginForm.value.username,
    password: this.loginForm.value.password
  };

  this.loginService.postLogin(data).subscribe(
    (res: any) => {
      localStorage.setItem('token', res.token);
      
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
      let errorMessage = 'Unknown error occurred'; // Default message

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

      alert(errorMessage); // Display the error message in an alert
      }
    );
  }
}
