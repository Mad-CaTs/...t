import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusProgressCircleComponent } from './status-progress-circle.component';

describe('StatusProgressCircleComponent', () => {
  let component: StatusProgressCircleComponent;
  let fixture: ComponentFixture<StatusProgressCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusProgressCircleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusProgressCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
