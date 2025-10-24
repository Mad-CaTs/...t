import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailComissionComponent } from './payment-detail-comission.component';

describe('PaymentDetailComissionComponent', () => {
	let component: PaymentDetailComissionComponent;
	let fixture: ComponentFixture<PaymentDetailComissionComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [PaymentDetailComissionComponent]
		});
		fixture = TestBed.createComponent(PaymentDetailComissionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
