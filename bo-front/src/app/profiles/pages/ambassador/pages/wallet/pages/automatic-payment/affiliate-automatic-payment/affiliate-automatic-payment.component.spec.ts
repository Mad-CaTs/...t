import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateAutomaticPaymentComponent } from './affiliate-automatic-payment.component';

describe('AffiliateAutomaticPaymentComponent', () => {
  let component: AffiliateAutomaticPaymentComponent;
  let fixture: ComponentFixture<AffiliateAutomaticPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffiliateAutomaticPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AffiliateAutomaticPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
