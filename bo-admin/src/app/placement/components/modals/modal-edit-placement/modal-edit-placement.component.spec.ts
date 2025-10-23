import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditPlacementComponent } from './modal-edit-placement.component';


describe('ModalEditPlacementComponent', () => {
  let component: ModalEditPlacementComponent;
  let fixture: ComponentFixture<ModalEditPlacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalEditPlacementComponent]
    });
    fixture = TestBed.createComponent(ModalEditPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
