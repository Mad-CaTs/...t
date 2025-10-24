import { TestBed } from '@angular/core/testing';

import { ReleasePointsService } from './release-points.service';

describe('ReleasePointsService', () => {
  let service: ReleasePointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleasePointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
