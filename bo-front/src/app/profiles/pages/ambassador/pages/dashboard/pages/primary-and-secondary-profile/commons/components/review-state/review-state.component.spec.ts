import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewStateComponent } from './review-state.component';

describe('ReviewStateComponent', () => {
  let component: ReviewStateComponent;
  let fixture: ComponentFixture<ReviewStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewStateComponent]
    });
    fixture = TestBed.createComponent(ReviewStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
