import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuccessPaymentComponent } from './modal-success-payment.component';

describe('ModalSuccessPaymentComponent', () => {
  let component: ModalSuccessPaymentComponent;
  let fixture: ComponentFixture<ModalSuccessPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalSuccessPaymentComponent]
    });
    fixture = TestBed.createComponent(ModalSuccessPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
