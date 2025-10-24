import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTransferNewPartnerSubscriptionComponent } from './modal-transfer-new-partner-subscription.component';

describe('ModalTransferNewPartnerComponent', () => {
  let component: ModalTransferNewPartnerSubscriptionComponent;
  let fixture: ComponentFixture<ModalTransferNewPartnerSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTransferNewPartnerSubscriptionComponent]
    });
    fixture = TestBed.createComponent(ModalTransferNewPartnerSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
