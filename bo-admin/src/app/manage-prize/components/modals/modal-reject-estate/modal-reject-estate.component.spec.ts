import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRejectEstateComponent } from './modal-reject-estate.component';

describe('ModalRejectEstateComponent', () => {
	let component: ModalRejectEstateComponent;
	let fixture: ComponentFixture<ModalRejectEstateComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalRejectEstateComponent]
		});
		fixture = TestBed.createComponent(ModalRejectEstateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});