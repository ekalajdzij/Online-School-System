import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://schoolsystemedusphereapi.azurewebsites.net/api/Users'

  constructor(private http: HttpClient, private router: Router) { }

  postLogin(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data)
      .pipe(
        map((response: { token: any; }) => {
          const token = response.token;
          const decodedToken: any = jwtDecode(token);
          const roles = decodedToken.role || null;
          return { ...response, roles };
        }),
        catchError(this.errorHandler)
      );
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

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
    document.cookie = "refresh=;exp=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
}
