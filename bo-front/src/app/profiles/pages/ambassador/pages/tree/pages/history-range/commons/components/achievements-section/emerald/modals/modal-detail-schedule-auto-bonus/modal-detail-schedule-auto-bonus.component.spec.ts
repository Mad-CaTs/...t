import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailScheduleAutoBonusComponent } from './modal-detail-schedule-auto-bonus.component';

describe('ModalDetailScheduleAutoBonusComponent', () => {
  let component: ModalDetailScheduleAutoBonusComponent;
  let fixture: ComponentFixture<ModalDetailScheduleAutoBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetailScheduleAutoBonusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailScheduleAutoBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
