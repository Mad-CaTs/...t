import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInComponent } from './dashboard-in.component';

describe('DashboardInComponent', () => {
  let component: DashboardInComponent;
  let fixture: ComponentFixture<DashboardInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardInComponent]
    });
    fixture = TestBed.createComponent(DashboardInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
