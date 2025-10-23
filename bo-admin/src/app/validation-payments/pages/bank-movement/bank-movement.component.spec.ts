import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMovementComponent } from './bank-movement.component';

describe('BankMovementComponent', () => {
  let component: BankMovementComponent;
  let fixture: ComponentFixture<BankMovementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankMovementComponent]
    });
    fixture = TestBed.createComponent(BankMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
