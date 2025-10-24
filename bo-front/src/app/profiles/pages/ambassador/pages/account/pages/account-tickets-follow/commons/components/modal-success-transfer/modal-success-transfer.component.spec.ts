import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuccessTransferComponent } from './modal-success-transfer.component';

describe('AlreadyExistsPartnerModalComponent', () => {
  let component: ModalSuccessTransferComponent;
  let fixture: ComponentFixture<ModalSuccessTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalSuccessTransferComponent]
    });
    fixture = TestBed.createComponent(ModalSuccessTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
