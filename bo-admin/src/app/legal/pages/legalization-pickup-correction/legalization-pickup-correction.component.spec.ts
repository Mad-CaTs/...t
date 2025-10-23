import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalizationPickupCorrectionComponent } from './legalization-pickup-correction.component';

describe('LegalizationPickupCorrectionComponent', () => {
  let component: LegalizationPickupCorrectionComponent;
  let fixture: ComponentFixture<LegalizationPickupCorrectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalizationPickupCorrectionComponent]
    });
    fixture = TestBed.createComponent(LegalizationPickupCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
