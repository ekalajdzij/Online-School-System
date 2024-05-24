import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  postLogin(data: any): Observable<any> {
    return this.http.post('https://schoolsystemedusphereapi.azurewebsites.net/api/Users/login' , data)
    .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => new Error(error.error));
  }

  getRoles = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  }
}
