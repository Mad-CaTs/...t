import { TestBed } from '@angular/core/testing';

import { NewPartnerService } from './new-partner.service';

describe('NewPartnerService', () => {
  let service: NewPartnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPartnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
