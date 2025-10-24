import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmShippingAddressComponent } from './confirm-shipping-address.component';

describe('ConfirmShippingAddressComponent', () => {
  let component: ConfirmShippingAddressComponent;
  let fixture: ComponentFixture<ConfirmShippingAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmShippingAddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmShippingAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
