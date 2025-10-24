import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentLegalComponent } from './modal-payment-legal.component';

describe('ModalPaymentLegalComponent', () => {
  let component: ModalPaymentLegalComponent;
  let fixture: ComponentFixture<ModalPaymentLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPaymentLegalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalPaymentLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
