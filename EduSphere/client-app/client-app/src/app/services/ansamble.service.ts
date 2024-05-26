import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AnsambleService {
  private apiAssUrl = 'https://schoolsystemedusphereapi.azurewebsites.net/api/Assitants'
  private apiProfUrl = 'https://schoolsystemedusphereapi.azurewebsites.net/api/Professors'
  constructor(private http: HttpClient) { }

  
  getAssistants(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiAssUrl}/all`, {headers})
    .pipe(catchError(this.errorHandler));
  }
  getAssistantById(id:number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiAssUrl}/${id}`, {headers})
    .pipe(catchError(this.errorHandler));
  }
  updateAssistant(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiAssUrl}/${id}`, data, {headers})
    .pipe(catchError(this.errorHandler));
  }
  getProfessors(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiProfUrl}/all`, {headers})
    .pipe(catchError(this.errorHandler));
  }
  getProfessorById(id:number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiProfUrl}/${id}`, {headers})
    .pipe(catchError(this.errorHandler));
  }
  updateProfessor(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiProfUrl}/${id}`, data, {headers})
    .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => new Error(error.error));
  }
}
