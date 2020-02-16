import { IAppDocument } from 'app/shared/model/documentmanager/app-document.model';

export interface ITag {
  id?: string;
  name?: string;
  documents?: IAppDocument[];
}

export class Tag implements ITag {
  constructor(public id?: string, public name?: string, public documents?: IAppDocument[]) {}
}
