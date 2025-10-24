import { ComponentFixture, TestBed } from '@angular/core/testing';

import ReleasePointsCardComponent from './release-points-card.component';

describe('ReleasePointsCardComponent', () => {
	let component: ReleasePointsCardComponent;
	let fixture: ComponentFixture<ReleasePointsCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ReleasePointsCardComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ReleasePointsCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
