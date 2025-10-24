import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentPaypalComponent } from './modal-payment-paypal.component';

describe('ModalPaymentPaypalComponent', () => {
  let component: ModalPaymentPaypalComponent;
  let fixture: ComponentFixture<ModalPaymentPaypalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPaymentPaypalComponent]
    });
    fixture = TestBed.createComponent(ModalPaymentPaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
