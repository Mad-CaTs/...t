import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsProgressCardComponent } from './points-progress-card.component';

describe('PointsProgressCardComponent', () => {
  let component: PointsProgressCardComponent;
  let fixture: ComponentFixture<PointsProgressCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsProgressCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointsProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
