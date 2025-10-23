import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditEventTypeComponent } from './modal-edit-event-type.component';

describe('ModalEditEventTypeComponent', () => {
  let component: ModalEditEventTypeComponent;
  let fixture: ComponentFixture<ModalEditEventTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalEditEventTypeComponent]
    });
    fixture = TestBed.createComponent(ModalEditEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
