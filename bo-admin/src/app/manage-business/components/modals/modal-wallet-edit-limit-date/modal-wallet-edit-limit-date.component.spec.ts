import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWalletEditLimitDateComponent } from './modal-wallet-edit-limit-date.component';

describe('ModalWalletEditLimitDateComponent', () => {
  let component: ModalWalletEditLimitDateComponent;
  let fixture: ComponentFixture<ModalWalletEditLimitDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalWalletEditLimitDateComponent]
    });
    fixture = TestBed.createComponent(ModalWalletEditLimitDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
