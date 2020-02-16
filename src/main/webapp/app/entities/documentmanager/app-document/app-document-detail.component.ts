import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IAppDocument } from 'app/shared/model/documentmanager/app-document.model';

@Component({
  selector: 'jhi-app-document-detail',
  templateUrl: './app-document-detail.component.html'
})
export class AppDocumentDetailComponent implements OnInit {
  appDocument: IAppDocument | null = null;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appDocument }) => {
      this.appDocument = appDocument;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  previousState(): void {
    window.history.back();
  }
}
