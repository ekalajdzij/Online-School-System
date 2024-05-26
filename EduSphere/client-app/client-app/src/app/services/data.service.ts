import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataId = new BehaviorSubject<number>(0);
  data$ = this.dataId.asObservable();
  private dataOption = new BehaviorSubject<string>('');
  option$ = this.dataOption.asObservable();
  
  setData(data: number) {
    this.dataId.next(data);
  }

  setDataOption(option: string) {
    console.log('Setting option:', option);	
    this.dataOption.next(option);
  }


}
