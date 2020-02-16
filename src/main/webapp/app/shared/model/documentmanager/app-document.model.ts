import { ICategory } from 'app/shared/model/documentmanager/category.model';
import { ITag } from 'app/shared/model/documentmanager/tag.model';

export interface IAppDocument {
  id?: string;
  content?: string;
  documentLink?: string;
  blobContentType?: string;
  blob?: any;
  category?: ICategory;
  tags?: ITag[];
}

export class AppDocument implements IAppDocument {
  constructor(
    public id?: string,
    public content?: string,
    public documentLink?: string,
    public blobContentType?: string,
    public blob?: any,
    public category?: ICategory,
    public tags?: ITag[]
  ) {}
}
