import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePointsComponent } from './release-points.component';

describe('ReleasePointsComponent', () => {
  let component: ReleasePointsComponent;
  let fixture: ComponentFixture<ReleasePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasePointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReleasePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
