import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnDestroy, OnInit {
  id: number = 0;
  private subscription: Subscription;
  username : string = '';
  showCourses: boolean = false;
  option: string = '';

  constructor(private router: Router, private dataService: DataService) {
    this.subscription = this.dataService.option$
      .pipe(
        tap((option: string) => {
          console.log('Received option:', option);
          this.option = option;
        })
      )
      .subscribe();
  }  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.dataService.setData(this.id); 
  }
}
