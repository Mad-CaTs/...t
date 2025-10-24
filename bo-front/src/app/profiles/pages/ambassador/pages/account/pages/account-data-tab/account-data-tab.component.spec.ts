import { ComponentFixture, TestBed } from '@angular/core/testing';
import AccountDataTabComponent from './account-data-tab.component';

describe('AccountDataTabComponent', () => {
  let component: AccountDataTabComponent;
  let fixture: ComponentFixture<AccountDataTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDataTabComponent]
    });
    fixture = TestBed.createComponent(AccountDataTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
