import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionEarnCarBonusComponent } from './option-earn-car-bonus.component';

describe('OptionEarnCarBonusComponent', () => {
  let component: OptionEarnCarBonusComponent;
  let fixture: ComponentFixture<OptionEarnCarBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionEarnCarBonusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionEarnCarBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
