import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAppDocument } from 'app/shared/model/documentmanager/app-document.model';
import { AppDocumentService } from './app-document.service';

@Component({
  templateUrl: './app-document-delete-dialog.component.html'
})
export class AppDocumentDeleteDialogComponent {
  appDocument?: IAppDocument;

  constructor(
    protected appDocumentService: AppDocumentService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.appDocumentService.delete(id).subscribe(() => {
      this.eventManager.broadcast('appDocumentListModification');
      this.activeModal.close();
    });
  }
}
