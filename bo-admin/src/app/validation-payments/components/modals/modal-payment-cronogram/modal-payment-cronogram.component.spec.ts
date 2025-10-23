import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentCronogramComponent } from './modal-payment-cronogram.component';

describe('ModalPaymentCronogramComponent', () => {
  let component: ModalPaymentCronogramComponent;
  let fixture: ComponentFixture<ModalPaymentCronogramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPaymentCronogramComponent]
    });
    fixture = TestBed.createComponent(ModalPaymentCronogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
