import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailShippingTypeComponent } from './email-shipping-type.component';

describe('EmailShippingTypeComponent', () => {
  let component: EmailShippingTypeComponent;
  let fixture: ComponentFixture<EmailShippingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailShippingTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailShippingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
