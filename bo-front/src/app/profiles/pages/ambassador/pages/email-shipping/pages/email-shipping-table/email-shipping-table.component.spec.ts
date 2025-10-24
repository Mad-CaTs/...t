import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailShippingTableComponent } from './email-shipping-table.component';

describe('EmailShippingTableComponent', () => {
  let component: EmailShippingTableComponent;
  let fixture: ComponentFixture<EmailShippingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailShippingTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailShippingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
