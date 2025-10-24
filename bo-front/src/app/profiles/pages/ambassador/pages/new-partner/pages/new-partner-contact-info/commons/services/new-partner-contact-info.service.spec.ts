import { TestBed } from '@angular/core/testing';

import { NewPartnerContactInfoService } from './new-partner-contact-info.service';

describe('NewPartnerContactInfoService', () => {
  let service: NewPartnerContactInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPartnerContactInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
