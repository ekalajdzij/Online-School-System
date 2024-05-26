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
import { AnsambleService } from '../services/ansamble.service';
import { UserService } from '../services/user.service';
import { Professor } from '../models/professor'; // Promijenjeno ime klase

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
  selector: 'app-viewprofessor', // Promijenjen selector
  templateUrl: './viewprofessor.component.html',
  styleUrls: ['./viewprofessor.component.css']
})
export class ViewProfessorComponent implements OnInit {
  closeResult: string = '';
  professorList: any = []; // Promijenjena lista u profesore
  selectedProfessorId: number | null = null;
  editingProfessor: any = null; // Promijenjeno ime varijable

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private professorService: AnsambleService, // Promijenjen servis
    private dataService: DataService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getProfessors(); // Promijenjen poziv metode za dohvat profesora
  }

  getProfessors() {
    this.professorService.getProfessors().pipe(
      tap(professors => {
        this.professorList = professors;
      }),
      catchError(() => {
        this.toastr.error('Failed to fetch professors');
        return of(null);
      }),
    ).subscribe();
  }

  startEdit(professor: Professor) { // Promijenjeno ime parametra
    this.editingProfessor = { ...professor }; // Promijenjen objekt
  }

  cancelEdit() {
    this.editingProfessor = null;
  }

  saveProfessor(): void {
    this.professorService.updateProfessor(this.editingProfessor.id, this.editingProfessor).pipe(
      tap(() => {
        this.toastr.success('Professor updated successfully');
        this.getProfessors();
        this.editingProfessor = null;
      }),
      catchError(() => {
        this.toastr.error('Failed to update professor');
        return of(null);
      }),
    ).subscribe();
  }

  deleteProfessor(id: number): void {
    this.userService.deleteUser(id).pipe(
      tap(() => {
        this.toastr.success('Professor deleted successfully');
        this.getProfessors();
        this.dataService.setDataOption('Professors');
      }),
      catchError(() => {
        this.toastr.error('Failed to delete professor');
        return of(null);
      }),
    ).subscribe();
  }

  openDeleteModal(id: number): void {
    console.log("uso u modal");
    const modalRef = this.modalService.open(NgModalConfirm, { backdrop: false });
    modalRef.result.then(
      (result) => {
        if (result === 'delete') {
          console.log("Pozvao metodu");
          this.deleteProfessor(id);
        }
      },
      (reason) => {
        this.toastr.info('Delete cancelled', 'Info');
      }
    );
  }

  postProfessor(): void {
    this.router.navigate(['addprofessor']);
  }

}
