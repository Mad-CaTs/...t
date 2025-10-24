import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyExistsPartnerSubscriptionModalComponent } from './already-exists-partner-modal-subscription.component';

describe('AlreadyExistsPartnerSubscriptionModalComponent', () => {
  let component: AlreadyExistsPartnerSubscriptionModalComponent;
  let fixture: ComponentFixture<AlreadyExistsPartnerSubscriptionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlreadyExistsPartnerSubscriptionModalComponent]
    });
    fixture = TestBed.createComponent(AlreadyExistsPartnerSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
