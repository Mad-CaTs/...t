import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalAffiliatesComponent } from './historical-affiliates.component';

describe('HistoricalAffiliatesComponent', () => {
  let component: HistoricalAffiliatesComponent;
  let fixture: ComponentFixture<HistoricalAffiliatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalAffiliatesComponent]
    });
    fixture = TestBed.createComponent(HistoricalAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
