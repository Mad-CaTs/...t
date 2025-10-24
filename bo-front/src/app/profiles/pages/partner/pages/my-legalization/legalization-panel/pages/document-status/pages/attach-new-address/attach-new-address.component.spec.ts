import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachNewAddressComponent } from './attach-new-address.component';

describe('AttachNewAddressComponent', () => {
  let component: AttachNewAddressComponent;
  let fixture: ComponentFixture<AttachNewAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachNewAddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttachNewAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
