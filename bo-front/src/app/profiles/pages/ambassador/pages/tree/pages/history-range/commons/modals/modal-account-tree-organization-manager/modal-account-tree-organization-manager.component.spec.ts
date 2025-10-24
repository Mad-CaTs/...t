import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAccountTreeOrganizationManagerComponent } from './modal-account-tree-organization-manager.component';

describe('ModalAccountTreeOrganizationManagerComponent', () => {
  let component: ModalAccountTreeOrganizationManagerComponent;
  let fixture: ComponentFixture<ModalAccountTreeOrganizationManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAccountTreeOrganizationManagerComponent]
    });
    fixture = TestBed.createComponent(ModalAccountTreeOrganizationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
