import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { imgGuard } from './img.guard';

describe('imgGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => imgGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
