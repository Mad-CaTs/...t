import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentBankComponent } from './modal-payment-bank.component';

describe('ModalPaymentBankComponent', () => {
  let component: ModalPaymentBankComponent;
  let fixture: ComponentFixture<ModalPaymentBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPaymentBankComponent]
    });
    fixture = TestBed.createComponent(ModalPaymentBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
