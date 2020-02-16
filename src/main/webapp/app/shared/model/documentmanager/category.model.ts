import { IAppDocument } from 'app/shared/model/documentmanager/app-document.model';

export interface ICategory {
  id?: string;
  name?: string;
  documents?: IAppDocument[];
}

export class Category implements ICategory {
  constructor(public id?: string, public name?: string, public documents?: IAppDocument[]) {}
}
