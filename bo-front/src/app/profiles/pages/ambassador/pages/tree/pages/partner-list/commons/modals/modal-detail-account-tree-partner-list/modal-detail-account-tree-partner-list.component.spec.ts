import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailAccountTreePartnerListComponent } from './modal-detail-account-tree-partner-list.component';

describe('ModalDetailAccountTreePartnerListComponent', () => {
  let component: ModalDetailAccountTreePartnerListComponent;
  let fixture: ComponentFixture<ModalDetailAccountTreePartnerListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetailAccountTreePartnerListComponent]
    });
    fixture = TestBed.createComponent(ModalDetailAccountTreePartnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
