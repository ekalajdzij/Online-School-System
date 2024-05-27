import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showLoginPage = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url === '/addcourse' ||
          event.url === '/addstudent' ||
          event.url === '/addassistant' ||
          event.url === '/addprofessor' ||
          event.url === '/viewcourseinfo' ||
          event.url === '/login'
        ) {
          document.body.style.backgroundColor = '#f0f8ff';
        } else if (event.url.startsWith('/viewcourseinfo/') || event.url.startsWith('/assignment/') || event.url.startsWith('/submission/')) {
          document.body.style.backgroundColor = 'darkslategrey';
        }
        else {
          document.body.style.backgroundColor = '';
        }
      }
    });
  }

  navigateToLogin() {
    this.showLoginPage = true;
    this.router.navigate(['/login']);
  }
}
