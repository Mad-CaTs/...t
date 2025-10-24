import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartnerPaymentComponent } from './new-partner-payment.component';

describe('NewPartnerPaymentComponent', () => {
  let component: NewPartnerPaymentComponent;
  let fixture: ComponentFixture<NewPartnerPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewPartnerPaymentComponent]
    });
    fixture = TestBed.createComponent(NewPartnerPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
