import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletTransactionsComponent } from './wallet-transactions.component';

describe('WalletTransactionsComponent', () => {
  let component: WalletTransactionsComponent;
  let fixture: ComponentFixture<WalletTransactionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalletTransactionsComponent]
    });
    fixture = TestBed.createComponent(WalletTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
