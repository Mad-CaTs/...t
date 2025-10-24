import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEditBankDataModalComponent } from './account-edit-bank-data-modal.component';

describe('AccountEditBankDataModalComponent', () => {
  let component: AccountEditBankDataModalComponent;
  let fixture: ComponentFixture<AccountEditBankDataModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountEditBankDataModalComponent]
    });
    fixture = TestBed.createComponent(AccountEditBankDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
