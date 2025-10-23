import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddEventSubtypeComponent } from './modal-add-event-subtype.component';

describe('ModalAddEventSubtypeComponent', () => {
  let component: ModalAddEventSubtypeComponent;
  let fixture: ComponentFixture<ModalAddEventSubtypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddEventSubtypeComponent]
    });
    fixture = TestBed.createComponent(ModalAddEventSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
