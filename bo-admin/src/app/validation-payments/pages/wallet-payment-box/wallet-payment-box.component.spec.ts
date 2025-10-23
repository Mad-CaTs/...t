import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletPaymentBoxComponent } from './wallet-payment-box.component';

describe('WalletPaymentBoxComponent', () => {
  let component: WalletPaymentBoxComponent;
  let fixture: ComponentFixture<WalletPaymentBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WalletPaymentBoxComponent]
    });
    fixture = TestBed.createComponent(WalletPaymentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
