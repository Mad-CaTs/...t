import { ComponentFixture, TestBed } from '@angular/core/testing';
import AccountPersonalTabComponent from './account-personal-tab.component';

describe('AccountPersonalTabComponent', () => {
  let component: AccountPersonalTabComponent;
  let fixture: ComponentFixture<AccountPersonalTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPersonalTabComponent]
    });
    fixture = TestBed.createComponent(AccountPersonalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
