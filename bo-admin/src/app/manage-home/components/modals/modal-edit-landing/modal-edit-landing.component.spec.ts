import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditLandingComponent } from './modal-edit-landing.component';


describe('ModalEditLandingComponent', () => {
  let component: ModalEditLandingComponent;
  let fixture: ComponentFixture<ModalEditLandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalEditLandingComponent]
    });
    fixture = TestBed.createComponent(ModalEditLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
