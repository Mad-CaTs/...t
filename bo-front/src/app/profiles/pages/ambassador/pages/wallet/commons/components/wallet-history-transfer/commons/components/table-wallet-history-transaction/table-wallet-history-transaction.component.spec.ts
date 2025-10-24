import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWalletHistoryTransactionComponent } from './table-wallet-history-transaction.component';

describe('TableWalletHistoryTransactionComponent', () => {
  let component: TableWalletHistoryTransactionComponent;
  let fixture: ComponentFixture<TableWalletHistoryTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWalletHistoryTransactionComponent]
    });
    fixture = TestBed.createComponent(TableWalletHistoryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
