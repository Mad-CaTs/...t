import { TestBed } from '@angular/core/testing';

import { RewardsPointsService } from './rewards-points.service';

describe('RewardsPointsService', () => {
	let service: RewardsPointsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RewardsPointsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
