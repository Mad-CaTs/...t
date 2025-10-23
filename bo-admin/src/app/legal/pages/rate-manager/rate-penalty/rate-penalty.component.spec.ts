import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatePenaltyComponent } from './rate-penalty.component';

describe('RatePenaltyComponent', () => {
  let component: RatePenaltyComponent;
  let fixture: ComponentFixture<RatePenaltyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RatePenaltyComponent]
    });
    fixture = TestBed.createComponent(RatePenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
