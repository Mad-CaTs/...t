import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTimelineStepComponent } from './status-timeline-step.component';

describe('StatusTimelineStepComponent', () => {
  let component: StatusTimelineStepComponent;
  let fixture: ComponentFixture<StatusTimelineStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusTimelineStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusTimelineStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
