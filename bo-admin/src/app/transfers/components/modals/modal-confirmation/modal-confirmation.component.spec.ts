import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmationTransferComponent } from './modal-confirmation.component';


describe('ModalConfirmationComponent', () => {
  let component: ModalConfirmationTransferComponent;
  let fixture: ComponentFixture<ModalConfirmationTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationTransferComponent]
    });
    fixture = TestBed.createComponent(ModalConfirmationTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
