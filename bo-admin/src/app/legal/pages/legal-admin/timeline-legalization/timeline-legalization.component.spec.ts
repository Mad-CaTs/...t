import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineLegalizationComponent } from './timeline-legalization.component';

describe('TimelineLegalizationComponent', () => {
  let component: TimelineLegalizationComponent;
  let fixture: ComponentFixture<TimelineLegalizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineLegalizationComponent]
    });
    fixture = TestBed.createComponent(TimelineLegalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
