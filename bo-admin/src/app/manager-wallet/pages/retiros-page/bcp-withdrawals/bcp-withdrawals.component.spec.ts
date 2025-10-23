import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcpWithdrawalsComponent } from './bcp-withdrawals.component';

describe('BcpWithdrawalsComponent', () => {
  let component: BcpWithdrawalsComponent;
  let fixture: ComponentFixture<BcpWithdrawalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BcpWithdrawalsComponent]
    });
    fixture = TestBed.createComponent(BcpWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
