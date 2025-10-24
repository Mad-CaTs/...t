import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalErrorComponent } from './modal-error.component';


describe('ModalErrorComponent', () => {
  let component: ModalErrorComponent;
  let fixture: ComponentFixture<ModalErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalErrorComponent]
    });
    fixture = TestBed.createComponent(ModalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
