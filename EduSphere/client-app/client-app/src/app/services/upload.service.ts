import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrl = 'https://schoolsystemedusphereapi.azurewebsites.net/api/Uploads/upload';
  
  constructor(private http: HttpClient) { }

  uploadFile(file: File, userId: number, assignmentId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    
    return this.http.post<any>(`${this.apiUrl}?userId=${userId}&assignmentId=${assignmentId}`, formData, { headers })
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(() => new Error(error.error));
  }
}