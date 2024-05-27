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
  loginForm!: FormGroup;
  isLoading = false; // Add this line

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

    this.isLoading = true;

    const data = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.loginService.postLogin(data).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.roles);
        localStorage.setItem('id', res.id);
        localStorage.setItem('username', this.loginForm.value.username);
        this.dataService.setData(res.id);

        this.isLoading = false;

        if (res.roles === 'Student') {
          this.router.navigate(['student']);
        } else if (res.roles === 'Professor') {
          this.router.navigate(['professor']);
        } else if (res.roles === 'Assistant') {
          this.router.navigate(['assistant']);
        } else if (res.roles === 'Admin') {
          this.router.navigate(['admin']);
        }
      },
      (error: any) => {
        let errorMessage = 'Unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `${error.error.message}`;
        } else if (error.status && error.message) {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        } else if (error.error && error.error.message) {
          errorMessage = `${error.error.message}`;
        } else if (error.message) {
          errorMessage = `${error.message}`;
        }

        this.isLoading = false;
        alert(errorMessage);
      }
    );
  }
}

