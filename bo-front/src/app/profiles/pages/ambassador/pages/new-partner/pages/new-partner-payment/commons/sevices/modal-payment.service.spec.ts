import { TestBed } from '@angular/core/testing';

import { ModalPaymentService } from './modal-payment.service';

describe('ModalPaymentService', () => {
  let service: ModalPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
