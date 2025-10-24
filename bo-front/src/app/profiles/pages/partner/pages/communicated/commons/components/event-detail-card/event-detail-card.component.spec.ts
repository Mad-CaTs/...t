import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailCardComponent } from './event-detail-card.component';

describe('EventDetailCardComponent', () => {
  let component: EventDetailCardComponent;
  let fixture: ComponentFixture<EventDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
