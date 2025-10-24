import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailDeleteBankDataModalComponent } from './account-detail-delete-bank-data-modal.component';

describe('AccountDetailDeleteBankDataModalComponent', () => {
  let component: AccountDetailDeleteBankDataModalComponent;
  let fixture: ComponentFixture<AccountDetailDeleteBankDataModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountDetailDeleteBankDataModalComponent]
    });
    fixture = TestBed.createComponent(AccountDetailDeleteBankDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
