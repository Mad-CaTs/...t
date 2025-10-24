import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAddCoRequesterModalComponent } from './account-add-co-requester-modal.component';

describe('AccountAddCoRequesterModalComponent', () => {
  let component: AccountAddCoRequesterModalComponent;
  let fixture: ComponentFixture<AccountAddCoRequesterModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountAddCoRequesterModalComponent]
    });
    fixture = TestBed.createComponent(AccountAddCoRequesterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
