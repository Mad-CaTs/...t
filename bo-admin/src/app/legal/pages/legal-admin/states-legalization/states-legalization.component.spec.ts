import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesLegalizationComponent } from './states-legalization.component';

describe('StatesLegalizationComponent', () => {
  let component: StatesLegalizationComponent;
  let fixture: ComponentFixture<StatesLegalizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatesLegalizationComponent]
    });
    fixture = TestBed.createComponent(StatesLegalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
