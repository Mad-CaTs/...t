import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateCalendarDropdownComponent } from './input-date-calendar-dropdown.component';

describe('InputDateCalendarDropdownComponent', () => {
  let component: InputDateCalendarDropdownComponent;
  let fixture: ComponentFixture<InputDateCalendarDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputDateCalendarDropdownComponent]
    });
    fixture = TestBed.createComponent(InputDateCalendarDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
