import { ComponentFixture, TestBed } from '@angular/core/testing';

import HistoricalRewardsComponent from './historical-rewards.component';

describe('HistoricalRewardsComponent', () => {
	let component: HistoricalRewardsComponent;
	let fixture: ComponentFixture<HistoricalRewardsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HistoricalRewardsComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HistoricalRewardsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
