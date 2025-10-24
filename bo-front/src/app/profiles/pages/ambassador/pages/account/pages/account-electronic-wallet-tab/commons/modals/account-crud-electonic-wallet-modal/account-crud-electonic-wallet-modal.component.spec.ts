import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCrudElectonicWalletModalComponent } from './account-crud-electonic-wallet-modal.component';

describe('AccountCrudElectonicWalletModalComponent', () => {
  let component: AccountCrudElectonicWalletModalComponent;
  let fixture: ComponentFixture<AccountCrudElectonicWalletModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountCrudElectonicWalletModalComponent]
    });
    fixture = TestBed.createComponent(AccountCrudElectonicWalletModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
