import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingPageComponent {
  showLoginPage = false;
  constructor(private router: Router) { }

  navigateToLogin() {
    this.showLoginPage = true;
    this.router.navigate(['/login']);
  }
}
