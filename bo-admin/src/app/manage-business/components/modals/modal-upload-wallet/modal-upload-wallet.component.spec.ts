import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploadWalletComponent } from './modal-upload-wallet.component';

describe('ModalUploadWalletComponent', () => {
  let component: ModalUploadWalletComponent;
  let fixture: ComponentFixture<ModalUploadWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalUploadWalletComponent]
    });
    fixture = TestBed.createComponent(ModalUploadWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
