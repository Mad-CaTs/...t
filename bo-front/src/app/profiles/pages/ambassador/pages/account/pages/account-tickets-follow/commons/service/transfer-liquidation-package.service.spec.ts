import { TestBed } from '@angular/core/testing';
import { TransferLiquidationService } from './transfer-liquidation-package.service';

describe('TransferLiquidationService', () => {
  let service: TransferLiquidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransferLiquidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
