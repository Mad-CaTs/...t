import { TestBed } from '@angular/core/testing';

import { LanguajesService } from './languajes.service';

describe('LanguajesService', () => {
  let service: LanguajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
