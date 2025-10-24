import { TestBed } from '@angular/core/testing';
import {  LegalizationValidateService } from './legalization-validate.service';

describe('PlacementService', () => {
	let service: LegalizationValidateService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(LegalizationValidateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
