import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalWalletDetailHistoryBankTransactionComponent } from './modal-wallet-detail-history-bank-transaction.component';


describe('ModalWalletDetailHistoryBankTransactionComponent', () => {
  let component: ModalWalletDetailHistoryBankTransactionComponent;
  let fixture: ComponentFixture<ModalWalletDetailHistoryBankTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWalletDetailHistoryBankTransactionComponent]
    });
    fixture = TestBed.createComponent(ModalWalletDetailHistoryBankTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
