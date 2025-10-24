import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPlacementErrorComponent } from './modal-placement-error.component';


describe('ModalPlacementErrorComponent', () => {
  let component: ModalPlacementErrorComponent;
  let fixture: ComponentFixture<ModalPlacementErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPlacementErrorComponent]
    });
    fixture = TestBed.createComponent(ModalPlacementErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});