import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToEarnPonitsComponent } from './how-to-earn-ponits.component';

describe('HowToEarnPonitsComponent', () => {
  let component: HowToEarnPonitsComponent;
  let fixture: ComponentFixture<HowToEarnPonitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToEarnPonitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowToEarnPonitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
