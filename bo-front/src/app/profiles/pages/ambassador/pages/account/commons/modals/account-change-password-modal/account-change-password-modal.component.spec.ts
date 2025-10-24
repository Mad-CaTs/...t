import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountChangePasswordModalComponent } from './account-change-password-modal.component';

describe('AccountChangePasswordModalComponent', () => {
  let component: AccountChangePasswordModalComponent;
  let fixture: ComponentFixture<AccountChangePasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountChangePasswordModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountChangePasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
