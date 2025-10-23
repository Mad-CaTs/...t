import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttendanceControlComponent } from './attendance-control.component';

describe('AttendanceControlComponent', () => {
  let component: AttendanceControlComponent;
  let fixture: ComponentFixture<AttendanceControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AttendanceControlComponent]
    });
    fixture = TestBed.createComponent(AttendanceControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
