import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPartnersByIdComponent } from './modal-partners-by-id.component';

describe('ModalPartnersByIdComponent', () => {
  let component: ModalPartnersByIdComponent;
  let fixture: ComponentFixture<ModalPartnersByIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPartnersByIdComponent]
    });
    fixture = TestBed.createComponent(ModalPartnersByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
