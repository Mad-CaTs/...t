import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationCommissionComponent } from './modal-confirmation-commission.component';

describe('ModalConfirmationCommissionComponent', () => {
  let component: ModalConfirmationCommissionComponent;
  let fixture: ComponentFixture<ModalConfirmationCommissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationCommissionComponent]
    });
    fixture = TestBed.createComponent(ModalConfirmationCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
