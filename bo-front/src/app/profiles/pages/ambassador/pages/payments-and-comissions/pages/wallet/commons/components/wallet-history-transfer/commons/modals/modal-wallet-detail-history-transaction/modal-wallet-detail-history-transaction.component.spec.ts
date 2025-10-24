import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWalletDetailHistoryTransactionComponent } from './modal-wallet-detail-history-transaction.component';

describe('ModalWalletDetailHistoryTransactionComponent', () => {
  let component: ModalWalletDetailHistoryTransactionComponent;
  let fixture: ComponentFixture<ModalWalletDetailHistoryTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWalletDetailHistoryTransactionComponent]
    });
    fixture = TestBed.createComponent(ModalWalletDetailHistoryTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
