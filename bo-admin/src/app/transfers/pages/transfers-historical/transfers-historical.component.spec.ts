import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersHistoricalComponent } from './transfers-historical.component';

describe('TransfersHistoricalComponent', () => {
  let component: TransfersHistoricalComponent;
  let fixture: ComponentFixture<TransfersHistoricalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TransfersHistoricalComponent]
    });
    fixture = TestBed.createComponent(TransfersHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
