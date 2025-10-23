import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthPeriodSelectorComponent } from './month-period-selector.component';

describe('MonthPeriodSelectorComponent', () => {
  let component: MonthPeriodSelectorComponent;
  let fixture: ComponentFixture<MonthPeriodSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthPeriodSelectorComponent]
    });
    fixture = TestBed.createComponent(MonthPeriodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
