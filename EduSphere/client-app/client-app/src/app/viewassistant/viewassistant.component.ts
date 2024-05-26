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
import { Assistant } from '../models/assistant';

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
  selector: 'app-viewassistant',
  templateUrl: './viewassistant.component.html',
  styleUrl: './viewassistant.component.css'
})
export class ViewAssistantComponent implements OnInit {
  closeResult: string = '';
  assistantList: any = [];
  selectedAssistantId: number | null = null;
  editingAssistant: any = null;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private assistantService: AnsambleService,
    private dataService: DataService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAssistants();
  }

  getAssistants() {
    this.assistantService.getAssistants().pipe(
      tap(assistants => {
        this.assistantList = assistants;
      }),
      catchError(() => {
        this.toastr.error('Failed to fetch assistants');
        return of(null);
      }),
    ).subscribe();
  }

  startEdit(assistant: Assistant) {
    this.editingAssistant = { ... assistant};
  }

  cancelEdit() {
    this.editingAssistant = null;
  }

  saveAssistant(): void {
    this.assistantService.updateAssistant(this.editingAssistant.id, this.editingAssistant).pipe(
      tap(() => {
        this.toastr.success('Assistant updated successfully');
        this.getAssistants();
        this.editingAssistant = null;
      }),
      catchError(() => {
        this.toastr.error('Failed to update assistant');
        return of(null);
      }),
    ).subscribe();
  }

  deleteAssistant(id: number): void {
    this.userService.deleteUser(id).pipe(
      tap(() => {
        this.toastr.success('Assistant deleted successfully');
        this.getAssistants();
        this.dataService.setDataOption('Assistants');
      }),
      catchError(() => {
        this.toastr.error('Failed to delete assistant');
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
          this.deleteAssistant(id);
        }
      },
      (reason) => {
        this.toastr.info('Delete cancelled', 'Info');
      }
    );
  }

  postAssistant(): void {
    this.router.navigate(['addassistant']);
  }

}
