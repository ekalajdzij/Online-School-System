import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnDestroy {
  id: number = 0;
  private subscription: Subscription;

  constructor(private router: Router, private dataService: DataService) {
    this.subscription = this.dataService.data$
      .pipe(
        tap((data: number) => {
          console.log('Received data:', data);
          this.id = data;
        })
      )
      .subscribe();
  }  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
