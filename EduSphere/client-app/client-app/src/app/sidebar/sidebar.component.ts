import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userRole: string | undefined;
  id: number = 0;
  username: any = localStorage.getItem('username') || undefined;
  selectedOption: string = '';


  constructor(private router: Router, private authService: AuthService, private userService: UserService, private dataService: DataService) {
  }

  ngOnInit() {
    this.userService.getUserById(this.id).subscribe((res: any) => {
      console.log(res);
      this.username = res.username;
      localStorage.setItem('id', res.id);
      localStorage.setItem('username', res.username);
    });
    this.userRole = localStorage.getItem('role') ?? undefined;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.dataService.setDataOption(this.selectedOption);
  }

  logout() {
    this.authService.logout();
    localStorage.clear();
  }
}
