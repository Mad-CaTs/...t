import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRejectTransferComponent } from './modal-reject-transfer.component';

describe('ModalRejectTransferComponent', () => {
	let component: ModalRejectTransferComponent;
	let fixture: ComponentFixture<ModalRejectTransferComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalRejectTransferComponent]
		});
		fixture = TestBed.createComponent(ModalRejectTransferComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});