import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletHistoryTransferComponent } from './wallet-history-transfer.component';

describe('WalletHistoryTransferComponent', () => {
  let component: WalletHistoryTransferComponent;
  let fixture: ComponentFixture<WalletHistoryTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletHistoryTransferComponent]
    });
    fixture = TestBed.createComponent(WalletHistoryTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
