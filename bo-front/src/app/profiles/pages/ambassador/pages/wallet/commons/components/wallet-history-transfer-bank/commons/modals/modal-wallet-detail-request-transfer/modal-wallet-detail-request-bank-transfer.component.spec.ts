import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalWalletDetailRequestBankTransferBankComponent } from './modal-wallet-detail-request-bank-transfer.component';


describe('ModalWalletDetailRequestBankTransferBankComponent', () => {
  let component: ModalWalletDetailRequestBankTransferBankComponent;
  let fixture: ComponentFixture<ModalWalletDetailRequestBankTransferBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWalletDetailRequestBankTransferBankComponent]
    });
    fixture = TestBed.createComponent(ModalWalletDetailRequestBankTransferBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
