import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewScheduleComponent } from './modal-view-schedule.component';

describe('ModalViewScheduleComponent', () => {
  let component: ModalViewScheduleComponent;
  let fixture: ComponentFixture<ModalViewScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalViewScheduleComponent]
    });
    fixture = TestBed.createComponent(ModalViewScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
