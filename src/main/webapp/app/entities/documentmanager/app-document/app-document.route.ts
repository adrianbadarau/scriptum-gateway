import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IAppDocument, AppDocument } from 'app/shared/model/documentmanager/app-document.model';
import { AppDocumentService } from './app-document.service';
import { AppDocumentComponent } from './app-document.component';
import { AppDocumentDetailComponent } from './app-document-detail.component';
import { AppDocumentUpdateComponent } from './app-document-update.component';

@Injectable({ providedIn: 'root' })
export class AppDocumentResolve implements Resolve<IAppDocument> {
  constructor(private service: AppDocumentService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppDocument> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((appDocument: HttpResponse<AppDocument>) => {
          if (appDocument.body) {
            return of(appDocument.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AppDocument());
  }
}

export const appDocumentRoute: Routes = [
  {
    path: '',
    component: AppDocumentComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'gatewayApp.documentmanagerAppDocument.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: AppDocumentDetailComponent,
    resolve: {
      appDocument: AppDocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.documentmanagerAppDocument.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: AppDocumentUpdateComponent,
    resolve: {
      appDocument: AppDocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.documentmanagerAppDocument.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: AppDocumentUpdateComponent,
    resolve: {
      appDocument: AppDocumentResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.documentmanagerAppDocument.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];
