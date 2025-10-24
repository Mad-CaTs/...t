import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePaymentsComissionComponent } from './table-payments-comission.component';

describe('TablePaymentsComissionComponent', () => {
	let component: TablePaymentsComissionComponent;
	let fixture: ComponentFixture<TablePaymentsComissionComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TablePaymentsComissionComponent]
		});
		fixture = TestBed.createComponent(TablePaymentsComissionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
