import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendationCardComponent } from './recomendation-card.component';

describe('RecomendationCardComponent', () => {
  let component: RecomendationCardComponent;
  let fixture: ComponentFixture<RecomendationCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecomendationCardComponent]
    });
    fixture = TestBed.createComponent(RecomendationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
