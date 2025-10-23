import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPromformaEstateComponent } from './modal-proforma-estate.component';

describe('ModalPromformaEstateComponent', () => {
	let component: ModalPromformaEstateComponent;
	let fixture: ComponentFixture<ModalPromformaEstateComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalPromformaEstateComponent]
		});
		fixture = TestBed.createComponent(ModalPromformaEstateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
