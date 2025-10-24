import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProgressComponent } from './account-progress.component';

describe('AccountProgressComponent', () => {
  let component: AccountProgressComponent;
  let fixture: ComponentFixture<AccountProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountProgressComponent]
    });
    fixture = TestBed.createComponent(AccountProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
