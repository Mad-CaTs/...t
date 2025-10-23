import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmBeneficiaryComponent } from './modal-confirm-beneficiary.component';

describe('ModalConfirmBeneficiaryComponent', () => {
  let component: ModalConfirmBeneficiaryComponent;
  let fixture: ComponentFixture<ModalConfirmBeneficiaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmBeneficiaryComponent]
    });
    fixture = TestBed.createComponent(ModalConfirmBeneficiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
