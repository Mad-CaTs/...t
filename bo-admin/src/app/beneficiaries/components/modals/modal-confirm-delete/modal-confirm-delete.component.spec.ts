import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmDeleteComponent } from './modal-confirm-delete.component';

describe('ModalConfirmDeleteComponent', () => {
  let component: ModalConfirmDeleteComponent;
  let fixture: ComponentFixture<ModalConfirmDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmDeleteComponent]
    });
    fixture = TestBed.createComponent(ModalConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
