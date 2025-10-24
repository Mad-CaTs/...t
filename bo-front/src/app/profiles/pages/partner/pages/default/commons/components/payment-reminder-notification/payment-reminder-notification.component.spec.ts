import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReminderNotificationComponent } from './payment-reminder-notification.component';

describe('PaymentReminderNotificationComponent', () => {
  let component: PaymentReminderNotificationComponent;
  let fixture: ComponentFixture<PaymentReminderNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReminderNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentReminderNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
