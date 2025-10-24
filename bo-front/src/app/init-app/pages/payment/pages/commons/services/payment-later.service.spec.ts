import { TestBed } from '@angular/core/testing';
import { PaymentLaterService } from './payment-later.service';

describe('PaymentLaterService', () => {
	let service: PaymentLaterService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PaymentLaterService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
