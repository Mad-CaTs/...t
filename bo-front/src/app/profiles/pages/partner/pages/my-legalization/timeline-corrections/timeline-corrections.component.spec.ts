import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineCorrectionsComponent } from './timeline-corrections.component';

describe('TimelineCorrectionsComponent', () => {
  let component: TimelineCorrectionsComponent;
  let fixture: ComponentFixture<TimelineCorrectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineCorrectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineCorrectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
