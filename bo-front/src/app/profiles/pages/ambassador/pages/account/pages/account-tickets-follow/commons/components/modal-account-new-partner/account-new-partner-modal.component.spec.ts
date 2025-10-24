import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNewPartnerModalComponent } from './account-new-partner-modal.component';

describe('AccountNewPartnerModalComponent', () => {
  let component: AccountNewPartnerModalComponent;
  let fixture: ComponentFixture<AccountNewPartnerModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountNewPartnerModalComponent]
    });
    fixture = TestBed.createComponent(AccountNewPartnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
