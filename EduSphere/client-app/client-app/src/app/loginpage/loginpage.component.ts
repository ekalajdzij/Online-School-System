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
        const roles = this.loginService.getRoles();

        localStorage.setItem('token', res.token);
        if (roles != null) localStorage.setItem('role', roles);
        localStorage.setItem('id', res.id);
        this.dataService.setData(res.id);

        if (roles === 'Student') {
          this.router.navigate(['student']);
        } 
        else if (roles === 'Professor' || roles === 'Assistant') {
          this.router.navigate(['ansamble']);
        } 
        else if (roles === 'Admin') {
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
