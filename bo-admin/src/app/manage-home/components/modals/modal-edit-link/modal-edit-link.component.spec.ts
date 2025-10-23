import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditLinkComponent } from './modal-edit-link.component';


describe('ModalEditLinkComponent', () => {
  let component: ModalEditLinkComponent;
  let fixture: ComponentFixture<ModalEditLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalEditLinkComponent]
    });
    fixture = TestBed.createComponent(ModalEditLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
