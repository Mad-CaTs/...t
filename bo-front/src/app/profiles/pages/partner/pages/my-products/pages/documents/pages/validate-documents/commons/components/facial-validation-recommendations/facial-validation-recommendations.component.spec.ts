import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacialValidationRecommendationsComponent } from './facial-validation-recommendations.component';

describe('FacialValidationRecommendationsComponent', () => {
  let component: FacialValidationRecommendationsComponent;
  let fixture: ComponentFixture<FacialValidationRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacialValidationRecommendationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacialValidationRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
