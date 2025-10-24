import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointVolumeComponentComponent } from './point-volume-component.component';

describe('PointVolumeComponentComponent', () => {
  let component: PointVolumeComponentComponent;
  let fixture: ComponentFixture<PointVolumeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointVolumeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PointVolumeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
