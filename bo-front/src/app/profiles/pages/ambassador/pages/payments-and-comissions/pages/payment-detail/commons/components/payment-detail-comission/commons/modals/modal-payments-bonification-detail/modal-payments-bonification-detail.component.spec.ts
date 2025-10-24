import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentsBonificationDetailComponent } from './modal-payments-bonification-detail.component';

describe('ModalPaymentsBonificationDetailComponent', () => {
  let component: ModalPaymentsBonificationDetailComponent;
  let fixture: ComponentFixture<ModalPaymentsBonificationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPaymentsBonificationDetailComponent]
    });
    fixture = TestBed.createComponent(ModalPaymentsBonificationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
