import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICategory } from 'app/shared/model/documentmanager/category.model';
import { CategoryService } from './category.service';

@Component({
  templateUrl: './category-delete-dialog.component.html'
})
export class CategoryDeleteDialogComponent {
  category?: ICategory;

  constructor(protected categoryService: CategoryService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.categoryService.delete(id).subscribe(() => {
      this.eventManager.broadcast('categoryListModification');
      this.activeModal.close();
    });
  }
}
