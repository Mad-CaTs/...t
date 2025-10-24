import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWalletRegisterTransferComponent } from './modal-wallet-register-transfer.component';

describe('ModalWalletRegisterTransferComponent', () => {
  let component: ModalWalletRegisterTransferComponent;
  let fixture: ComponentFixture<ModalWalletRegisterTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWalletRegisterTransferComponent]
    });
    fixture = TestBed.createComponent(ModalWalletRegisterTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
