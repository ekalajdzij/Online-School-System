import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showLoginPage = false;
  constructor(private router: Router) { }

  openNavbar() {
    const sideNav = document.getElementById('sideNavigationBar');
    if (sideNav) {
      sideNav.style.width = '250px';
    }
  }

  closeNavbar() {
    const sideNav = document.getElementById('sideNavigationBar');
    if (sideNav) {
      sideNav.style.width = '0';
    }
  }
  navigateToLogin() {
    this.showLoginPage = true;
    this.router.navigate(['/login']);
  }
}
