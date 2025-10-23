import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeletePartnerRegisterComponent } from './modal-delete-partner-register.component';

describe('ModalDeletePartnerRegisterComponent', () => {
  let component: ModalDeletePartnerRegisterComponent;
  let fixture: ComponentFixture<ModalDeletePartnerRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDeletePartnerRegisterComponent]
    });
    fixture = TestBed.createComponent(ModalDeletePartnerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
