import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneMenuComponent } from './phone-menu.component';

describe('PhoneMenuComponent', () => {
  let component: PhoneMenuComponent;
  let fixture: ComponentFixture<PhoneMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneMenuComponent]
    });
    fixture = TestBed.createComponent(PhoneMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
