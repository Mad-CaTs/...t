import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBusinessInfoTabComponent } from './account-business-info-tab.component';

describe('AccountBusinessInfoTabComponent', () => {
  let component: AccountBusinessInfoTabComponent;
  let fixture: ComponentFixture<AccountBusinessInfoTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountBusinessInfoTabComponent]
    });
    fixture = TestBed.createComponent(AccountBusinessInfoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
