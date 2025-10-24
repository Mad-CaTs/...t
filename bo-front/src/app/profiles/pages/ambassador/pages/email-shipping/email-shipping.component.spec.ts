import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailShippingComponent } from './email-shipping.component';

describe('EmailShippingComponent', () => {
  let component: EmailShippingComponent;
  let fixture: ComponentFixture<EmailShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailShippingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
