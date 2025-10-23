import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultipleDropdownComponent } from './select-multiple-dropdown.component';

describe('SelectMultipleDropdownComponent', () => {
  let component: SelectMultipleDropdownComponent;
  let fixture: ComponentFixture<SelectMultipleDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectMultipleDropdownComponent]
    });
    fixture = TestBed.createComponent(SelectMultipleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
