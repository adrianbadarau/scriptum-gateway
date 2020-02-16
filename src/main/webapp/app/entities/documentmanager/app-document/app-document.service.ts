import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAppDocument } from 'app/shared/model/documentmanager/app-document.model';

type EntityResponseType = HttpResponse<IAppDocument>;
type EntityArrayResponseType = HttpResponse<IAppDocument[]>;

@Injectable({ providedIn: 'root' })
export class AppDocumentService {
  public resourceUrl = SERVER_API_URL + 'services/documentmanager/api/app-documents';

  constructor(protected http: HttpClient) {}

  create(appDocument: IAppDocument): Observable<EntityResponseType> {
    return this.http.post<IAppDocument>(this.resourceUrl, appDocument, { observe: 'response' });
  }

  update(appDocument: IAppDocument): Observable<EntityResponseType> {
    return this.http.put<IAppDocument>(this.resourceUrl, appDocument, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAppDocument>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppDocument[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
