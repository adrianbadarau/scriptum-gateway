import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'app-document',
        loadChildren: () => import('./documentmanager/app-document/app-document.module').then(m => m.DocumentmanagerAppDocumentModule)
      },
      {
        path: 'category',
        loadChildren: () => import('./documentmanager/category/category.module').then(m => m.DocumentmanagerCategoryModule)
      },
      {
        path: 'tag',
        loadChildren: () => import('./documentmanager/tag/tag.module').then(m => m.DocumentmanagerTagModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class GatewayEntityModule {}
