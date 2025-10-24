import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAccountTreeActivationManagerDetailComponent } from './modal-account-tree-activation-manager-detail.component';

describe('ModalAccountTreeActivationManagerDetailComponent', () => {
  let component: ModalAccountTreeActivationManagerDetailComponent;
  let fixture: ComponentFixture<ModalAccountTreeActivationManagerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAccountTreeActivationManagerDetailComponent]
    });
    fixture = TestBed.createComponent(ModalAccountTreeActivationManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
