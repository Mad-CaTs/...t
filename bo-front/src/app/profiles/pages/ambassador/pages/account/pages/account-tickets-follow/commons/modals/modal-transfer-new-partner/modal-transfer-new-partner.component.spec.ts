import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTransferNewPartnerComponent } from './modal-transfer-new-partner.component';

describe('ModalTransferNewPartnerComponent', () => {
  let component: ModalTransferNewPartnerComponent;
  let fixture: ComponentFixture<ModalTransferNewPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTransferNewPartnerComponent]
    });
    fixture = TestBed.createComponent(ModalTransferNewPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
