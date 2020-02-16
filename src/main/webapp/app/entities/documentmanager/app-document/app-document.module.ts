import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { AppDocumentComponent } from './app-document.component';
import { AppDocumentDetailComponent } from './app-document-detail.component';
import { AppDocumentUpdateComponent } from './app-document-update.component';
import { AppDocumentDeleteDialogComponent } from './app-document-delete-dialog.component';
import { appDocumentRoute } from './app-document.route';

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(appDocumentRoute)],
  declarations: [AppDocumentComponent, AppDocumentDetailComponent, AppDocumentUpdateComponent, AppDocumentDeleteDialogComponent],
  entryComponents: [AppDocumentDeleteDialogComponent]
})
export class DocumentmanagerAppDocumentModule {}
