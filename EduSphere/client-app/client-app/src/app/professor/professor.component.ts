import { Component } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrl: './professor.component.css'
})
export class ProfessorComponent {
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

  ngOnInit() {
    this.dataService.setData(this.id);
    console.log("id dobijen u professor komp je " + this.id);
    console.log("opcija dobijen u professor komp je " + this.option);

  }
}
