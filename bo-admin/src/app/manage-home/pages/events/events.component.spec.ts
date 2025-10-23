import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsContainerComponent } from './events.component';

describe('EventsContainerComponent', () => {
	let component: EventsContainerComponent;
	let fixture: ComponentFixture<EventsContainerComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [EventsContainerComponent]
		});
		fixture = TestBed.createComponent(EventsContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
