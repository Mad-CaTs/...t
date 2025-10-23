import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRejectCarComponent } from './modal-reject-car.component';

describe('ModalRejectCarComponent', () => {
	let component: ModalRejectCarComponent;
	let fixture: ComponentFixture<ModalRejectCarComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalRejectCarComponent]
		});
		fixture = TestBed.createComponent(ModalRejectCarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});