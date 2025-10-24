import { TestBed } from '@angular/core/testing';
import { NewPartnerGeneralInfoService } from './new-partner-general-info.service';

describe('NewPartnerGeneralInfoService', () => {
	let service: NewPartnerGeneralInfoService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NewPartnerGeneralInfoService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
