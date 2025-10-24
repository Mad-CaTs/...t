import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletHistoryTransferBankComponent } from './wallet-history-transfer-bank.component';


describe('WalletHistoryTransferBankComponent', () => {
  let component: WalletHistoryTransferBankComponent;
  let fixture: ComponentFixture<WalletHistoryTransferBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletHistoryTransferBankComponent]
    });
    fixture = TestBed.createComponent(WalletHistoryTransferBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
