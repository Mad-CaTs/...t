import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailCourseComponent } from './modal-detail-course.component';

describe('ModalDetailCourseComponent', () => {
  let component: ModalDetailCourseComponent;
  let fixture: ComponentFixture<ModalDetailCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalDetailCourseComponent]
    });
    fixture = TestBed.createComponent(ModalDetailCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
