import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWalletOperationComponent } from './modal-wallet-operation.component';

describe('ModalWalletOperationComponent', () => {
  let component: ModalWalletOperationComponent;
  let fixture: ComponentFixture<ModalWalletOperationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalWalletOperationComponent]
    });
    fixture = TestBed.createComponent(ModalWalletOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
