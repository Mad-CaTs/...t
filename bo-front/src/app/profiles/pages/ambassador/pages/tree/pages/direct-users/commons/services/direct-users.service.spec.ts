import { TestBed } from '@angular/core/testing';
import { DirectUsersService } from './direct-users.service';

describe('PlacementService', () => {
	let service: DirectUsersService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DirectUsersService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
