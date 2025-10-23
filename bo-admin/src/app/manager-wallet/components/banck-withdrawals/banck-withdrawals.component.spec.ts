import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanckWithdrawalsComponent } from './banck-withdrawals.component';

describe('BanckWithdrawalsComponent', () => {
  let component: BanckWithdrawalsComponent;
  let fixture: ComponentFixture<BanckWithdrawalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BanckWithdrawalsComponent]
    });
    fixture = TestBed.createComponent(BanckWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
