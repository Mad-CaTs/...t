import { TestBed } from '@angular/core/testing';

import { UserPointsBalanceService } from './user-points-balance.service';

describe('UserPointsBalanceService', () => {
  let service: UserPointsBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPointsBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
