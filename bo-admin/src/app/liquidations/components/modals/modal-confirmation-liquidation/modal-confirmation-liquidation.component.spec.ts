import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalConfirmationLiquidationComponent } from './modal-confirmation-liquidation.component';


describe('ModalConfirmationLiquidationComponent', () => {
  let component: ModalConfirmationLiquidationComponent;
  let fixture: ComponentFixture<ModalConfirmationLiquidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationLiquidationComponent]
    });
    fixture = TestBed.createComponent(ModalConfirmationLiquidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
