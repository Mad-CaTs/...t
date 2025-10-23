import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateTimeDropdownComponent } from './input-date-time-dropdown.component';

describe('InputDateTimeDropdownComponent', () => {
  let component: InputDateTimeDropdownComponent;
  let fixture: ComponentFixture<InputDateTimeDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputDateTimeDropdownComponent]
    });
    fixture = TestBed.createComponent(InputDateTimeDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
