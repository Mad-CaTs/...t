import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRejectLiquidationComponent } from './modal-reject-liquidation.component';

describe('ModalRejectLiquidationComponent', () => {
	let component: ModalRejectLiquidationComponent;
	let fixture: ComponentFixture<ModalRejectLiquidationComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalRejectLiquidationComponent]
		});
		fixture = TestBed.createComponent(ModalRejectLiquidationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});