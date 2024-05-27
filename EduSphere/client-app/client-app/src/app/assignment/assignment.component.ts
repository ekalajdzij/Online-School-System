import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../services/assignment.service';
import { AnsambleService } from '../services/ansamble.service';
import { UploadService } from '../services/upload.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  assignment: any;
  id: number = 0;
  professor: any;
  assistant: any;
  professorIds: number[] = [];
  assistantIds: number[] = [];
  canUpload: boolean = false;
  sasToken: string = 'sp=racwdli&st=2024-05-27T18:31:10Z&se=2026-09-05T02:31:10Z&spr=https&sv=2022-11-02&sr=c&sig=oRLq2MYGXL0zhm80Q1VV9vVKaprGzUlZajKhpk%2F%2F41Y%3D';

  constructor(
    private route: ActivatedRoute,
    private assignmentService: AssignmentService,
    private ansambleService: AnsambleService,
    private uploadService: UploadService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.assignmentService.getAssignmentById(id).subscribe((res: any) => {
      console.log(res);
      this.assignment = res;
      console.log(this.assignment);

      this.ansambleService.getProfessorById(this.assignment.professorId).subscribe((professorRes: any) => {
        this.professor = professorRes;
      });

      this.ansambleService.getAssistantById(this.assignment.assistantId).subscribe((assistantRes: any) => {
        this.assistant = assistantRes;
      });

      this.canUpload = !this.deadlinePassed(this.assignment.deadline);
    });
  }

  deadlinePassed(deadline: Date): boolean {
    return new Date() > new Date(deadline);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const userId: number = Number(localStorage.getItem('id'));
      const assignmentId: number = this.assignment.id;
      this.uploadService.uploadFile(file, userId, assignmentId).subscribe((res: any) => {
        alert('File uploaded successfully');
        // Handle success response
      }, (error: any) => {
        console.error('Error uploading file:', error);
        // Handle error response
      });
    }
  }
  getFileNameFromUrl(url: string): string {
    return url ? url.split('/').pop() || 'download' : 'download';
  }

  downloadAssignment() {
    if (this.assignment && this.assignment.fileAssignment) {
      const fileUrl = `${this.assignment.fileAssignment}?${this.sasToken}`;
      this.http.get(fileUrl, { responseType: 'blob' }).subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.getFileNameFromUrl(this.assignment.fileAssignment);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    } else {
      console.error('File submission URL is null or undefined');
    }
  }
}
