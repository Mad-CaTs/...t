import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventSubtypesComponent } from './event-subtypes.component';

describe('EventSubtypesComponent', () => {
  let component: EventSubtypesComponent;
  let fixture: ComponentFixture<EventSubtypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventSubtypesComponent]
    });
    fixture = TestBed.createComponent(EventSubtypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
