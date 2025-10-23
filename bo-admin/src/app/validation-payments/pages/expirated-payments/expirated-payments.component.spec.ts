import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiratedPaymentsComponent } from './expirated-payments.component';

describe('ExpiratedPaymentsComponent', () => {
  let component: ExpiratedPaymentsComponent;
  let fixture: ComponentFixture<ExpiratedPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExpiratedPaymentsComponent]
    });
    fixture = TestBed.createComponent(ExpiratedPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
