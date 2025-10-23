import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyPackageComponent } from './family-package.component';

describe('PackagesComponent', () => {
	let component: FamilyPackageComponent;
	let fixture: ComponentFixture<FamilyPackageComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [FamilyPackageComponent]
		});
		fixture = TestBed.createComponent(FamilyPackageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
