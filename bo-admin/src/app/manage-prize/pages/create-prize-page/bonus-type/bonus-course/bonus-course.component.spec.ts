import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonusCourseComponent } from './bonus-course.component';

describe('BonusCourseComponent', () => {
  let component: BonusCourseComponent;
  let fixture: ComponentFixture<BonusCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BonusCourseComponent]
    });
    fixture = TestBed.createComponent(BonusCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
