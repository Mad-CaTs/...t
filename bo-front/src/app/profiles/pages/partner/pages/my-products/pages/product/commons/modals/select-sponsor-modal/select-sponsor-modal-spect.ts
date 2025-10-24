import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSponsorModal } from './select-sponsor-modal';

describe('AlreadyExistsPartnerSubscriptionModalComponent', () => {
  let component: SelectSponsorModal;
  let fixture: ComponentFixture<SelectSponsorModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectSponsorModal]
    });
    fixture = TestBed.createComponent(SelectSponsorModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
