import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../services/assignment.service';
import { AnsambleService } from '../services/ansamble.service';
import { UploadService } from '../services/upload.service';
import { SubmissionService } from '../services/submission.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrl: './submission.component.css'
})
export class SubmissionComponent {
  submission: any;
  id: number = 0;
  student: any;
  assignment: any;
  professorIds: number[] = [];
  assistantIds: number[] = [];
  canUpload: boolean = false;
  role: string = '';

  constructor(
    private route: ActivatedRoute,
    private submissionService: SubmissionService,
    private studentService: StudentService,
    private uploadService: UploadService,
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

  deadlinePassed(deadline: Date): boolean {
    return new Date() > new Date(deadline);
  }

  submitGrade() {
    console.log(this.submission.studentId+"student id");
    console.log(this.submission.assignmentId + "submisija")
    this.submissionService.updateSubmissonAnsamble(this.submission.studentId, this.submission).subscribe((res: any) => {
        alert("Grade and comment submitted successfully.");
    });
}


}
