import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalRejectPlacementComponent } from './modal-reject-placement.component';


describe('ModalRejectPlacementComponent', () => {
  let component: ModalRejectPlacementComponent;
  let fixture: ComponentFixture<ModalRejectPlacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRejectPlacementComponent]
    });
    fixture = TestBed.createComponent(ModalRejectPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});