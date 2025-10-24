import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoBonusScheduleComponent } from './auto-bonus-schedule.component';

describe('AutoBonusScheduleComponent', () => {
  let component: AutoBonusScheduleComponent;
  let fixture: ComponentFixture<AutoBonusScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoBonusScheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutoBonusScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
