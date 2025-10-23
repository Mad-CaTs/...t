import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterbankWithdrawalsComponent } from './interbank-withdrawals.component';

describe('InterbankWithdrawalsComponent', () => {
  let component: InterbankWithdrawalsComponent;
  let fixture: ComponentFixture<InterbankWithdrawalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterbankWithdrawalsComponent]
    });
    fixture = TestBed.createComponent(InterbankWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
