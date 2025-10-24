import { ComponentFixture, TestBed } from '@angular/core/testing';
import AccountTicketsFollowComponent from './account-tickets-follow.component';

describe('AccountTicketsFollowComponent', () => {
  let component: AccountTicketsFollowComponent;
  let fixture: ComponentFixture<AccountTicketsFollowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountTicketsFollowComponent]
    });
    fixture = TestBed.createComponent(AccountTicketsFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
