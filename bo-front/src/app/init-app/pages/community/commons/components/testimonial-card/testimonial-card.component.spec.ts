import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialCardComponent } from './testimonial-card.component';

describe('TestimonialCardComponent', () => {
  let component: TestimonialCardComponent;
  let fixture: ComponentFixture<TestimonialCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestimonialCardComponent]
    });
    fixture = TestBed.createComponent(TestimonialCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
