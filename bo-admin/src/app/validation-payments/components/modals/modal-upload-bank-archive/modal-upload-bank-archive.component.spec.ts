import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploadBankArchiveComponent } from './modal-upload-bank-archive.component';

describe('ModalUploadBankArchiveComponent', () => {
  let component: ModalUploadBankArchiveComponent;
  let fixture: ComponentFixture<ModalUploadBankArchiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalUploadBankArchiveComponent]
    });
    fixture = TestBed.createComponent(ModalUploadBankArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
