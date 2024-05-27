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
export class SidebarComponent implements OnInit, OnDestroy {
  userRole: string | undefined;
  id: number = 0;
  username: any = localStorage.getItem('username') || undefined;
  private subscription: Subscription;
  selectedOption: string = '';


  constructor(private router: Router, private authService: AuthService, private userService: UserService, private dataService: DataService) {
    this.subscription = this.dataService.data$
    .pipe(
      tap((data : number) => {
        this.id = data;
      })
    )
    .subscribe();
  }

  ngOnInit() {
    const roles = this.authService.getRoles();
    this.userService.getUserById(this.id).subscribe((res: any) => {
      console.log(res);
      this.username = res.username;
      localStorage.setItem('id', res.id);
      localStorage.setItem('username', res.username);
    });
    this.userRole = roles !== null ? roles : undefined;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.dataService.setDataOption(this.selectedOption);
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('username');
  }
}
