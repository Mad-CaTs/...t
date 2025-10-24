import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalizationInfoComponent } from './legalization-info.component';

describe('LegalizationInfoComponent', () => {
  let component: LegalizationInfoComponent;
  let fixture: ComponentFixture<LegalizationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalizationInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalizationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
