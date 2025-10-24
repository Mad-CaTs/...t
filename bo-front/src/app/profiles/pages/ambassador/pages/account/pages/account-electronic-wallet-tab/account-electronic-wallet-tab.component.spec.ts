import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountElectronicWalletTabComponent } from './account-electronic-wallet-tab.component';

describe('AccountElectronicWalletTabComponent', () => {
  let component: AccountElectronicWalletTabComponent;
  let fixture: ComponentFixture<AccountElectronicWalletTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountElectronicWalletTabComponent]
    });
    fixture = TestBed.createComponent(AccountElectronicWalletTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
