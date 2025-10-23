import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialPaymentsComponent } from './initial-payments.component';

describe('InitialPaymentsComponent', () => {
  let component: InitialPaymentsComponent;
  let fixture: ComponentFixture<InitialPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InitialPaymentsComponent]
    });
    fixture = TestBed.createComponent(InitialPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
