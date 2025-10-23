import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpsertChangeTypeComponent } from './modal-upsert-change-type.component';

describe('ModalUpsertChangeTypeComponent', () => {
  let component: ModalUpsertChangeTypeComponent;
  let fixture: ComponentFixture<ModalUpsertChangeTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalUpsertChangeTypeComponent]
    });
    fixture = TestBed.createComponent(ModalUpsertChangeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
