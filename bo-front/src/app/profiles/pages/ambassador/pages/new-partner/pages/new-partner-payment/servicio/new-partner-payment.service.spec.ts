import { TestBed } from '@angular/core/testing';

import { NewPartnerPaymentService } from './new-partner-payment.service';

describe('NewPartnerPaymentService', () => {
  let service: NewPartnerPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPartnerPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
