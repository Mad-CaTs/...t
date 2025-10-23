import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRejectTravelComponent } from './modal-reject-travel.component';

describe('ModalRejectTravelComponent', () => {
	let component: ModalRejectTravelComponent;
	let fixture: ComponentFixture<ModalRejectTravelComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalRejectTravelComponent]
		});
		fixture = TestBed.createComponent(ModalRejectTravelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});