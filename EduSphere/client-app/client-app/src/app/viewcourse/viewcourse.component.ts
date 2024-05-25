import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../services/courses.service';
import { AnsambleService } from '../services/ansamble.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs'

@Component({
  selector: 'ng-modal-confirm',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">Confirm Deletion</h4>
      <button type="button" class="close" aria-label="Close" (click)="modal.dismiss()">
      </button>
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

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private courseService: CourseService,
    private ansambleService: AnsambleService	
  ) {}

  ngOnInit(): void {
    this.getCourses();
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

  updateCourse(id: number, data: any): void {
    this.courseService.updateCourse(id, data).pipe(
      tap(() => {
        this.toastr.success('Course updated successfully', 'Success');
        this.getCourses();
      }),
      catchError(error => {
        this.toastr.error('Failed to update course', 'Error');
        console.error(error);
        return of(null);
      })
    ).subscribe();
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).pipe(
      tap(() => {
        this.toastr.success('Course deleted successfully', 'Success');
        this.getCourses();
      }),
      catchError(error => {
        this.toastr.error('Failed to delete course', 'Error');
        console.error(error);
        return of(null);
      })
    ).subscribe();
  }

  openDeleteModal(id: number): void {
    const modalRef = this.modalService.open(NgModalConfirm, { backdrop: false });
    modalRef.result.then(
      (result) => {
        if (result === 'delete') {
          this.deleteCourse(id);
          this.router.navigate([this.router.url]);
        }
      },
      (reason) => {
        this.toastr.info('Delete cancelled', 'Info');
      }
    );
  }

  postCourse() {
    this.router.navigate(['create-course']);
  }
  /*postCourse(data: any): void {
    this.courseService.postCourse(data).pipe(
      tap(() => {
        this.toastr.success('Course added successfully', 'Success');
        this.getCourses();
      }),
      catchError(error => {
        this.toastr.error('Failed to add course', 'Error');
        console.error(error);
        return of(null);
      })
    ).subscribe();
  }*/
}
