import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataId = new BehaviorSubject<number>(0);
  data$ = this.dataId.asObservable();
  
  setData(data: number) {
    this.dataId.next(data);
  }
}
