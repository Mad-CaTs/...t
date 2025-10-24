import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailOverviewComponent } from './payment-detail-overview.component';

describe('PaymentDetailOverviewComponent', () => {
  let component: PaymentDetailOverviewComponent;
  let fixture: ComponentFixture<PaymentDetailOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentDetailOverviewComponent]
    });
    fixture = TestBed.createComponent(PaymentDetailOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
