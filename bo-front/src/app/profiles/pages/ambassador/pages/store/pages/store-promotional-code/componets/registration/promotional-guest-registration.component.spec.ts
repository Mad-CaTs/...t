import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalGuestRegistrationComponent } from './promotional-guest-registration.component';

describe('PromotionalGuestRegistrationComponent', () => {
  let component: PromotionalGuestRegistrationComponent;
  let fixture: ComponentFixture<PromotionalGuestRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionalGuestRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotionalGuestRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
