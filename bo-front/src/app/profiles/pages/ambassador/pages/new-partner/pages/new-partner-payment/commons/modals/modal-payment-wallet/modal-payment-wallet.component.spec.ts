import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentWalletComponent } from './modal-payment-wallet.component';

describe('ModalPaymentWalletComponent', () => {
  let component: ModalPaymentWalletComponent;
  let fixture: ComponentFixture<ModalPaymentWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPaymentWalletComponent]
    });
    fixture = TestBed.createComponent(ModalPaymentWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
