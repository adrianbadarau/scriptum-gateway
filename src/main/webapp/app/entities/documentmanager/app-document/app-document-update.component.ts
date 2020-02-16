import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IAppDocument, AppDocument } from 'app/shared/model/documentmanager/app-document.model';
import { AppDocumentService } from './app-document.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ICategory } from 'app/shared/model/documentmanager/category.model';
import { CategoryService } from 'app/entities/documentmanager/category/category.service';
import { ITag } from 'app/shared/model/documentmanager/tag.model';
import { TagService } from 'app/entities/documentmanager/tag/tag.service';

type SelectableEntity = ICategory | ITag;

@Component({
  selector: 'jhi-app-document-update',
  templateUrl: './app-document-update.component.html'
})
export class AppDocumentUpdateComponent implements OnInit {
  isSaving = false;

  categories: ICategory[] = [];

  tags: ITag[] = [];

  editForm = this.fb.group({
    id: [],
    content: [null, [Validators.required]],
    documentLink: [null, [Validators.required]],
    blob: [],
    blobContentType: [],
    category: [null, Validators.required],
    tags: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected appDocumentService: AppDocumentService,
    protected categoryService: CategoryService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appDocument }) => {
      this.updateForm(appDocument);

      this.categoryService
        .query()
        .pipe(
          map((res: HttpResponse<ICategory[]>) => {
            return res.body ? res.body : [];
          })
        )
        .subscribe((resBody: ICategory[]) => (this.categories = resBody));

      this.tagService
        .query()
        .pipe(
          map((res: HttpResponse<ITag[]>) => {
            return res.body ? res.body : [];
          })
        )
        .subscribe((resBody: ITag[]) => (this.tags = resBody));
    });
  }

  updateForm(appDocument: IAppDocument): void {
    this.editForm.patchValue({
      id: appDocument.id,
      content: appDocument.content,
      documentLink: appDocument.documentLink,
      blob: appDocument.blob,
      blobContentType: appDocument.blobContentType,
      category: appDocument.category,
      tags: appDocument.tags
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('gatewayApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appDocument = this.createFromForm();
    if (appDocument.id !== undefined) {
      this.subscribeToSaveResponse(this.appDocumentService.update(appDocument));
    } else {
      this.subscribeToSaveResponse(this.appDocumentService.create(appDocument));
    }
  }

  private createFromForm(): IAppDocument {
    return {
      ...new AppDocument(),
      id: this.editForm.get(['id'])!.value,
      content: this.editForm.get(['content'])!.value,
      documentLink: this.editForm.get(['documentLink'])!.value,
      blobContentType: this.editForm.get(['blobContentType'])!.value,
      blob: this.editForm.get(['blob'])!.value,
      category: this.editForm.get(['category'])!.value,
      tags: this.editForm.get(['tags'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppDocument>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: ITag[], option: ITag): ITag {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
