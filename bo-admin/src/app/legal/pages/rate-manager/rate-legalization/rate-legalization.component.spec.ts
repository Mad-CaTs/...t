import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateLegalizationComponent } from './rate-legalization.component';

describe('RateLegalizationComponent', () => {
  let component: RateLegalizationComponent;
  let fixture: ComponentFixture<RateLegalizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateLegalizationComponent]
    });
    fixture = TestBed.createComponent(RateLegalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
