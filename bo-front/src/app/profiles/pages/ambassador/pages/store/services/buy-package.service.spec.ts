import { TestBed } from '@angular/core/testing';
import { BuyPackageService } from './buy-package.service';

describe('BuyPackageService', () => {
	let service: BuyPackageService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BuyPackageService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
