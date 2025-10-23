import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcceptPaymentComponent } from './modal-accept-payment.component';

describe('ModalAcceptPaymentComponent', () => {
  let component: ModalAcceptPaymentComponent;
  let fixture: ComponentFixture<ModalAcceptPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalAcceptPaymentComponent]
    });
    fixture = TestBed.createComponent(ModalAcceptPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
