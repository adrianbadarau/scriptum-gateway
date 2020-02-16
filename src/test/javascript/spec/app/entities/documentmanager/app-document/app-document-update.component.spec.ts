import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { AppDocumentUpdateComponent } from 'app/entities/documentmanager/app-document/app-document-update.component';
import { AppDocumentService } from 'app/entities/documentmanager/app-document/app-document.service';
import { AppDocument } from 'app/shared/model/documentmanager/app-document.model';

describe('Component Tests', () => {
  describe('AppDocument Management Update Component', () => {
    let comp: AppDocumentUpdateComponent;
    let fixture: ComponentFixture<AppDocumentUpdateComponent>;
    let service: AppDocumentService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [AppDocumentUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(AppDocumentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AppDocumentUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AppDocumentService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new AppDocument('123');
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new AppDocument();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
