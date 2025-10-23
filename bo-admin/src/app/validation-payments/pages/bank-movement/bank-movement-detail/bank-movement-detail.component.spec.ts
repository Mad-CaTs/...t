import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMovementDetailComponent } from './bank-movement-detail.component';

describe('BankMovementDetailComponent', () => {
  let component: BankMovementDetailComponent;
  let fixture: ComponentFixture<BankMovementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankMovementDetailComponent]
    });
    fixture = TestBed.createComponent(BankMovementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
