import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBankDataTabComponent } from './account-bank-data-tab.component';

describe('AccountBankDataTabComponent', () => {
  let component: AccountBankDataTabComponent;
  let fixture: ComponentFixture<AccountBankDataTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountBankDataTabComponent]
    });
    fixture = TestBed.createComponent(AccountBankDataTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
