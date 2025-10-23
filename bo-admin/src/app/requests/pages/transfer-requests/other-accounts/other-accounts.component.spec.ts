import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherAccountsComponent } from './other-accounts.component';

describe('OtherAccountsComponent', () => {
  let component: OtherAccountsComponent;
  let fixture: ComponentFixture<OtherAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OtherAccountsComponent]
    });
    fixture = TestBed.createComponent(OtherAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
