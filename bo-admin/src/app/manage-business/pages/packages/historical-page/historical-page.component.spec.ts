import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalPageComponent } from './historical-page.component';

describe('HistoricalPageComponent', () => {
  let component: HistoricalPageComponent;
  let fixture: ComponentFixture<HistoricalPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalPageComponent]
    });
    fixture = TestBed.createComponent(HistoricalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
