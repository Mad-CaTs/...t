import { TestBed } from '@angular/core/testing';

import { NewPartnerSelectPackageService } from './new-partner-select-package.service';

describe('NewPartnerSelectPackageService', () => {
  let service: NewPartnerSelectPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewPartnerSelectPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
