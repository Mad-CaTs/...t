import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressForeignComponent } from './shipping-address-foreign.component';

describe('ShippingAddressForeignComponent', () => {
  let component: ShippingAddressForeignComponent;
  let fixture: ComponentFixture<ShippingAddressForeignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingAddressForeignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShippingAddressForeignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
