import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPromformaCarComponent } from './modal-proforma-car.component';

describe('ModalPromformaCarComponent', () => {
	let component: ModalPromformaCarComponent;
	let fixture: ComponentFixture<ModalPromformaCarComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalPromformaCarComponent]
		});
		fixture = TestBed.createComponent(ModalPromformaCarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
