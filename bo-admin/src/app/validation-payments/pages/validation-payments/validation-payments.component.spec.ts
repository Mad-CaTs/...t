import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationPaymentComponent } from './validation-payments.component';

describe('PendingPaymentsComponent', () => {
  let component: ValidationPaymentComponent;
  let fixture: ComponentFixture<ValidationPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationPaymentComponent]
    });
    fixture = TestBed.createComponent(ValidationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
