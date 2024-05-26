import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs'
import { Course } from '../models/course';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { StudentService } from '../services/student.service';
import { UserService } from '../services/user.service';
import { Student } from '../models/student';

@Component({
  selector: 'ng-modal-confirm',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Confirm Deletion</h4>
    </div>
    <div class="modal-body">
      Are you sure you want to delete this course?
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="modal.close('delete')">Delete</button>
      <button type="button" class="btn btn-primary" (click)="modal.dismiss()">Cancel</button>
    </div>
  `,
})
export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-viewstudent',
  templateUrl: './viewstudent.component.html',
  styleUrl: './viewstudent.component.css'
})
export class ViewStudentComponent implements OnInit {
  closeResult: string = '';
  studentList: any = [];
  selectedStudentId: number | null = null;
  editingStudent: any = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private studentService:StudentService,
    private dataService: DataService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getAllStudents().pipe(
      tap(students => {
        this.studentList = students;
      }),
      catchError(() => {
        this.toastr.error('Failed to fetch students');
        return of(null);
      }),
    ).subscribe();
  }

  startEdit(student: Student) {
    this.editingStudent= { ... student};
  }

  cancelEdit() {
    this.editingStudent = null;
  }

  saveStudent(): void {
    this.studentService.updateStudentProfile(this.editingStudent.id, this.editingStudent).pipe(
      tap(() => {
        this.toastr.success('Student updated successfully');
        this.getStudents();
        this.editingStudent = null;
      }),
      catchError(() => {
        this.toastr.error('Failed to update student');
        return of(null);
      }),
    ).subscribe();
  }

  deleteStudent(id: number): void {
    this.userService.deleteUser(id).pipe(
      tap(() => {
        this.toastr.success('Student deleted successfully');
        this.getStudents();
        this.dataService.setDataOption('Students');
      }),
      catchError(() => {
        this.toastr.error('Failed to delete student');
        return of(null);
      }),
    )
  }

  openDeleteModal(id: number): void {
    const modalRef = this.modalService.open(NgModalConfirm, { backdrop: false });
    modalRef.result.then(
      (result) => {
        if (result === 'delete') {
          this.deleteStudent(id);
        }
      },
      (reason) => {
        this.toastr.info('Delete cancelled', 'Info');
      }
    );
  }

  postStudent(): void {
    this.router.navigate(['addstudent']);
  }

}
