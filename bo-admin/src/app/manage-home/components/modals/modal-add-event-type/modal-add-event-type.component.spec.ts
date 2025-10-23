import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddEventTypeComponent } from './modal-add-event-type.component';

describe('ModalAddEventTypeComponent', () => {
  let component: ModalAddEventTypeComponent;
  let fixture: ComponentFixture<ModalAddEventTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddEventTypeComponent]
    });
    fixture = TestBed.createComponent(ModalAddEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
