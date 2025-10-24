import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryRangeComponent } from './history-range.component';

describe('HistoryRangeComponent', () => {
  let component: HistoryRangeComponent;
  let fixture: ComponentFixture<HistoryRangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryRangeComponent]
    });
    fixture = TestBed.createComponent(HistoryRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
