import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailRateLimitModalComponent } from './email-rate-limit-modal.component';


describe('EmailRateLimitModalComponent', () => {
  let component: EmailRateLimitModalComponent;
  let fixture: ComponentFixture<EmailRateLimitModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailRateLimitModalComponent]
    });
    fixture = TestBed.createComponent(EmailRateLimitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});