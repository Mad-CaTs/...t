import { ComponentFixture, TestBed } from '@angular/core/testing';
import HistoricalExchangeComponent from './historical-exchange.component';

describe('HistoricalExchangeComponent', () => {
	let component: HistoricalExchangeComponent;
	let fixture: ComponentFixture<HistoricalExchangeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HistoricalExchangeComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HistoricalExchangeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
