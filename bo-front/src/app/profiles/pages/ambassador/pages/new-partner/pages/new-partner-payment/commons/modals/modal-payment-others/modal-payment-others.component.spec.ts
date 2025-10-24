import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentOthersComponent } from './modal-payment-others.component';

describe('ModalPaymentOthersComponent', () => {
  let component: ModalPaymentOthersComponent;
  let fixture: ComponentFixture<ModalPaymentOthersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPaymentOthersComponent]
    });
    fixture = TestBed.createComponent(ModalPaymentOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
