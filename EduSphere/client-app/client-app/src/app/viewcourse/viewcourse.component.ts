import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../services/courses.service';
import { AnsambleService } from '../services/ansamble.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs'
import { Course } from '../models/course';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';

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
  selector: 'app-viewcourse',
  templateUrl: './viewcourse.component.html',
  styleUrls: ['./viewcourse.component.css']
})
export class ViewCourseComponent implements OnInit {
  closeResult: string = '';
  courseList: any = [];
  selectedCourseId: number | null = null;
  professors: any = [];
  assistants: any = [];
  editingCourse: any = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private courseService: CourseService,
    private ansambleService: AnsambleService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.getCourses()
    }, 250);
    this.getProfessorsAndAssistants();
  }

  getCourses(): void {
    this.courseService.getCourses().pipe(
      tap((courses: any[]) => {
        forkJoin(
          courses.map(course => {
            return forkJoin({
              professor: this.ansambleService.getProfessorById(course.professorId),
              assistant: this.ansambleService.getAssistantById(course.assistantId)
            }).pipe(
              tap(({ professor, assistant }) => {
                course.professorName = `${professor.title} ${professor.name}`;
                course.assistantName = `${assistant.title} ${assistant.name}`;
              })
            );
          })
        ).subscribe(() => {
          this.courseList = courses;
          console.log(this.courseList);
        });
      }),
      catchError(error => {
        this.toastr.error('Failed to load courses', 'Error');
        console.error(error);
        return of(null);
      }),
      finalize(() => {
        // Ovdje možete dodati logiku koja će se izvršiti nakon završetka observable-a
      })
    ).subscribe();
  }

  getProfessorsAndAssistants(): void {
    forkJoin({
      professors: this.ansambleService.getProfessors(),
      assistants: this.ansambleService.getAssistants()
    }).pipe(
      tap(({ professors, assistants }) => {
        this.professors = professors;
        this.assistants = assistants;
      }),
      catchError(error => {
        this.toastr.error('Failed to load professors and assistants', 'Error');
        return of(null);
      })
    ).subscribe();
  }

  getCourseById(id: number): void {
    this.courseService.getCourseById(id).pipe(
      tap(data => {
        console.log(data);
        this.toastr.success('Course loaded successfully', 'Success');
      }),
      catchError(error => {
        this.toastr.error('Failed to load course', 'Error');
        console.error(error);
        return of(null);
      }),
      finalize(() => {
      })
    ).subscribe();
  }

  startEdit(course: Course) {
    this.editingCourse = { ... course};
  }

  cancelEdit() {
    this.editingCourse = null;
  }

  saveCourse(): void {
    if (this.editingCourse) {
      this.courseService.updateCourse(this.editingCourse.id, this.editingCourse).pipe(
        tap(() => {
          this.toastr.success('Course updated successfully', 'Success');
          this.getCourses();
          this.editingCourse = null;
        }),
        catchError(error => {
          this.toastr.error('Failed to update course', 'Error');
          return of(null);
        })
      ).subscribe();
    }
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).pipe(
      tap(() => {
        this.toastr.success('Course deleted successfully', 'Success');
        this.router.navigate(['admin']);
      }),
      catchError(error => {
        this.toastr.error('Failed to delete course', 'Error');
        return of(null);
      })
    ).subscribe(() => {
    });
  }

  openDeleteModal(id: number): void {
    const modalRef = this.modalService.open(NgModalConfirm, { backdrop: false });
    modalRef.result.then(
      (result) => {
        if (result === 'delete') {
          this.dataService.setDataOption('Courses');
          this.deleteCourse(id);
        }
      },
      (reason) => {
        this.toastr.info('Delete cancelled', 'Info');
      }
    );
  }

  postCourse() {
    this.router.navigate(['addcourse']);
  }
}
