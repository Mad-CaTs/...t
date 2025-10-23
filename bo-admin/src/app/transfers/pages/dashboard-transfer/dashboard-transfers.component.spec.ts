import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTransfersComponent } from './dashboard-transfers.component';

describe('DashboardTransfersComponent', () => {
  let component: DashboardTransfersComponent;
  let fixture: ComponentFixture<DashboardTransfersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardTransfersComponent]
    });
    fixture = TestBed.createComponent(DashboardTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
