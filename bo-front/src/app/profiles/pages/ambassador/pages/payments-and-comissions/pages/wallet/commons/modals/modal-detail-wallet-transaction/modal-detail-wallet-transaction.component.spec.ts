import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailWalletTransactionComponent } from './modal-detail-wallet-transaction.component';

describe('ModalDetailWalletTransactionComponent', () => {
  let component: ModalDetailWalletTransactionComponent;
  let fixture: ComponentFixture<ModalDetailWalletTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetailWalletTransactionComponent]
    });
    fixture = TestBed.createComponent(ModalDetailWalletTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
