import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubmissionService } from '../services/submission.service';
import { StudentService } from '../services/student.service';
import { AssignmentService } from '../services/assignment.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  submission: any;
  id: number = 0;
  student: any;
  assignment: any;
  professorIds: number[] = [];
  assistantIds: number[] = [];
  canUpload: boolean = false;
  role: string = '';
  sasToken: string = 'sp=racwdli&st=2024-05-27T18:31:10Z&se=2026-09-05T02:31:10Z&spr=https&sv=2022-11-02&sr=c&sig=oRLq2MYGXL0zhm80Q1VV9vVKaprGzUlZajKhpk%2F%2F41Y%3D'; // vaš SAS token

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private submissionService: SubmissionService,
    private studentService: StudentService,
    private assignmentService: AssignmentService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.role = localStorage.getItem('role') ?? '';
    if (this.role == 'Professor' || this.role == 'Assistant') this.canUpload = true;
    this.submissionService.getSubmissionById(id).subscribe((res: any) => {
      console.log(res);
      this.submission = res;
      console.log(this.submission);

      this.studentService.getStudentById(this.submission.studentId).subscribe((studentRes: any) => {
        this.student = studentRes;
      });

      this.assignmentService.getAssignmentById(this.submission.assignmentId).subscribe((assignmentRes: any) => {
        this.assignment = assignmentRes;
      });

    });
  }

  downloadSubmission() {
    if (this.submission && this.submission.fileSubmission) {
      const fileUrl = `${this.submission.fileSubmission}?${this.sasToken}`;
      this.http.get(fileUrl, { responseType: 'blob' }).subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.getFileNameFromUrl(this.submission.fileSubmission);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    } else {
      console.error('File submission URL is null or undefined');
    }
  }

  downloadFile(url: string) {
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = url.split('/').pop()!;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  getFileNameFromUrl(url: string): string {
    return url ? url.split('/').pop() || 'download' : 'download';
  }

  deadlinePassed(deadline: Date): boolean {
    return new Date() > new Date(deadline);
  }

  submitGrade() {
    if (this.submission.grade !== null && this.submission.comment !== null) {
      this.submissionService.updateSubmissonAnsamble(this.submission.id, this.submission).subscribe((res: any) => {
        alert("Grade and comment updated successfully.");
      });
    } else {
      const newSubmission = {
        studentId: this.submission.studentId,
        assignmentId: this.submission.assignmentId,
        grade: this.submission.grade,
        comment: this.submission.comment
      };
      this.submissionService.submitSubmission(newSubmission).subscribe((res: any) => {
        alert("Grade and comment submitted successfully.");
      });
    }
  }
}
