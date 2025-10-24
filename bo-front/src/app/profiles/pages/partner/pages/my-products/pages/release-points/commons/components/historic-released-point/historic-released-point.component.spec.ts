import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricReleasedPointComponent } from './historic-released-point.component';

describe('HistoricReleasedPointComponent', () => {
  let component: HistoricReleasedPointComponent;
  let fixture: ComponentFixture<HistoricReleasedPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricReleasedPointComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricReleasedPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
