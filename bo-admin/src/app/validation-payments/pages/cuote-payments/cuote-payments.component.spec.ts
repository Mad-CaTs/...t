import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuotePaymentsComponent } from './cuote-payments.component';

describe('CuotePaymentsComponent', () => {
  let component: CuotePaymentsComponent;
  let fixture: ComponentFixture<CuotePaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuotePaymentsComponent]
    });
    fixture = TestBed.createComponent(CuotePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
