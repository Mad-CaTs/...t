import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidationMembershipComponent } from './modal-liquidation-membership.component';

describe('LiquidationMembershipComponent', () => {
  let component: LiquidationMembershipComponent;
  let fixture: ComponentFixture<LiquidationMembershipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LiquidationMembershipComponent]
    });
    fixture = TestBed.createComponent(LiquidationMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
