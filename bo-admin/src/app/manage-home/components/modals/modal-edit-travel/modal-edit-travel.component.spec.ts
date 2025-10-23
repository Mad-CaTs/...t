import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditTravelComponent } from './modal-edit-travel.component';


describe('ModalEditTravelComponent', () => {
  let component: ModalEditTravelComponent;
  let fixture: ComponentFixture<ModalEditTravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalEditTravelComponent]
    });
    fixture = TestBed.createComponent(ModalEditTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
