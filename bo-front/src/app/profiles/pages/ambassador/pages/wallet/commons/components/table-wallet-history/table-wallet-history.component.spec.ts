import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWalletHistoryComponent } from './table-wallet-history.component';

describe('TableWalletHistoryComponent', () => {
  let component: TableWalletHistoryComponent;
  let fixture: ComponentFixture<TableWalletHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableWalletHistoryComponent]
    });
    fixture = TestBed.createComponent(TableWalletHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
