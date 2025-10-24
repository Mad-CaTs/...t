import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableWalletHistoryTransactionBankComponent } from './table-wallet-history-transaction-bank.component';


describe('TableWalletHistoryTransactionBankComponent', () => {
  let component: TableWalletHistoryTransactionBankComponent;
  let fixture: ComponentFixture<TableWalletHistoryTransactionBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWalletHistoryTransactionBankComponent]
    });
    fixture = TestBed.createComponent(TableWalletHistoryTransactionBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
