import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRejectPaymentComponent } from './modal-reject-payment.component';

describe('ModalRejectPaymentComponent', () => {
  let component: ModalRejectPaymentComponent;
  let fixture: ComponentFixture<ModalRejectPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalRejectPaymentComponent]
    });
    fixture = TestBed.createComponent(ModalRejectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
