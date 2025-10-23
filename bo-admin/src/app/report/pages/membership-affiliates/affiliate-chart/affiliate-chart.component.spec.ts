import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateChartComponent } from './affiliate-chart.component';

describe('AffiliateChartComponent', () => {
  let component: AffiliateChartComponent;
  let fixture: ComponentFixture<AffiliateChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateChartComponent]
    });
    fixture = TestBed.createComponent(AffiliateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
