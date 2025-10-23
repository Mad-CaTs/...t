import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditEventSubtypeComponent } from './modal-edit-event-subtype.component';

describe('ModalEditEventSubtypeComponent', () => {
  let component: ModalEditEventSubtypeComponent;
  let fixture: ComponentFixture<ModalEditEventSubtypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalEditEventSubtypeComponent]
    });
    fixture = TestBed.createComponent(ModalEditEventSubtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});