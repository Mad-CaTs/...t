import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddLinkComponent } from './modal-add-link.component';


describe('ModalAddLinkComponent', () => {
  let component: ModalAddLinkComponent;
  let fixture: ComponentFixture<ModalAddLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddLinkComponent]
    });
    fixture = TestBed.createComponent(ModalAddLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
