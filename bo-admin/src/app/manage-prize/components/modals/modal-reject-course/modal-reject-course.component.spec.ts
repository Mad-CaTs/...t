import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRejectCourseComponent } from './modal-reject-course.component';

describe('ModalRejectCourseComponent', () => {
	let component: ModalRejectCourseComponent;
	let fixture: ComponentFixture<ModalRejectCourseComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ModalRejectCourseComponent]
		});
		fixture = TestBed.createComponent(ModalRejectCourseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
