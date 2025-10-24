import { TestBed } from '@angular/core/testing';
import { LegalizationService } from './legalization.service';

describe('PlacementService', () => {
	let service: LegalizationService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LegalizationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
