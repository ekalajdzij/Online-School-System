import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userRole: string | undefined;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const roles = this.authService.getRoles();
    this.userRole = roles !== null ? roles : undefined;
  }

  logout() {
    this.authService.logout();
  }
}
