import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddLandingComponent } from './modal-add-landing.component';


describe('ModalAddLandingComponent', () => {
  let component: ModalAddLandingComponent;
  let fixture: ComponentFixture<ModalAddLandingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddLandingComponent]
    });
    fixture = TestBed.createComponent(ModalAddLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
