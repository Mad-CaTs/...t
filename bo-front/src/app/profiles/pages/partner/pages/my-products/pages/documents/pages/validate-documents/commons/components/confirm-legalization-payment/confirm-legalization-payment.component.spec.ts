import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmLegalizationPaymentComponent } from './confirm-legalization-payment.component';

describe('ConfirmLegalizationPaymentComponent', () => {
  let component: ConfirmLegalizationPaymentComponent;
  let fixture: ComponentFixture<ConfirmLegalizationPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmLegalizationPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmLegalizationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
