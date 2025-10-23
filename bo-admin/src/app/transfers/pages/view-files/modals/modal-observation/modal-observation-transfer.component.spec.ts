import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalObservationTransferComponent } from './modal-observation-transfer.component';

describe('ModalRejectTransferComponent', () => {
	let component: ModalObservationTransferComponent;
	let fixture: ComponentFixture<ModalObservationTransferComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalObservationTransferComponent]
		});
		fixture = TestBed.createComponent(ModalObservationTransferComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});