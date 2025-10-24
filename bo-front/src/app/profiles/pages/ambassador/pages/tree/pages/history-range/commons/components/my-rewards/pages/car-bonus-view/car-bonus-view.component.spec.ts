import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarBonusViewComponent } from './car-bonus-view.component';

describe('CarBonusViewComponent', () => {
  let component: CarBonusViewComponent;
  let fixture: ComponentFixture<CarBonusViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarBonusViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarBonusViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
