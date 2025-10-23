import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuccessComponent } from './modal-success.component';

describe('ModalConfirmationComponent', () => {
	let component: ModalSuccessComponent;
	let fixture: ComponentFixture<ModalSuccessComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ModalSuccessComponent]
		});
		fixture = TestBed.createComponent(ModalSuccessComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
