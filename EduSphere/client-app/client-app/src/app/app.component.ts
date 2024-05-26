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
        if (event.url === '/addcourse') { // Zamijeni sa rutom tvoje komponente
          document.body.style.backgroundColor = '#f0f8ff'; // Postavi željenu boju pozadine
        } else {
          // Resetuj boju pozadine ako nije ruta za tvoju komponentu
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
