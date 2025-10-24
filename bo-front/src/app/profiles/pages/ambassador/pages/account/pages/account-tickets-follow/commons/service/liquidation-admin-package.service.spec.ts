import { TestBed } from '@angular/core/testing';

import { LiquidationAdminPackageService } from './liquidation-admin-package.service';

describe('LiquidationAdminPackageService', () => {
  let service: LiquidationAdminPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiquidationAdminPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
