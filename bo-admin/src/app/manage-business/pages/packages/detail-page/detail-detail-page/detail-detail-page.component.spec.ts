import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDetailPageComponent } from './detail-detail-page.component';

describe('DetailDetailPageComponent', () => {
	let component: DetailDetailPageComponent;
	let fixture: ComponentFixture<DetailDetailPageComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [DetailDetailPageComponent]
		});
		fixture = TestBed.createComponent(DetailDetailPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
