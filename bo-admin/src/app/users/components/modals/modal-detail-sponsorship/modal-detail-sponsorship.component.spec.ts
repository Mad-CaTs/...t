import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailSponsorshipComponent } from './modal-detail-sponsorship.component';

describe('ModalDetailSponsorshipComponent', () => {
  let component: ModalDetailSponsorshipComponent;
  let fixture: ComponentFixture<ModalDetailSponsorshipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetailSponsorshipComponent]
    });
    fixture = TestBed.createComponent(ModalDetailSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
