import { TestBed } from '@angular/core/testing';

import { NewApiService } from './new-api.service';

describe('NewApiService', () => {
  let service: NewApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
