import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDeletePlacementComponent } from './modal-delete-placement.component';


describe('ModalDeletePlacementComponent', () => {
  let component: ModalDeletePlacementComponent;
  let fixture: ComponentFixture<ModalDeletePlacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalDeletePlacementComponent]
    });
    fixture = TestBed.createComponent(ModalDeletePlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
