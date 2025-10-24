import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWalletDetailRequestTransferComponent } from './modal-wallet-detail-request-transfer.component';

describe('ModalWalletDetailRequestTransferComponent', () => {
  let component: ModalWalletDetailRequestTransferComponent;
  let fixture: ComponentFixture<ModalWalletDetailRequestTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWalletDetailRequestTransferComponent]
    });
    fixture = TestBed.createComponent(ModalWalletDetailRequestTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
