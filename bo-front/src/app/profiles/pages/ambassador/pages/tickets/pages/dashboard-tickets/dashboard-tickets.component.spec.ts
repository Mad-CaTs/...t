import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTicketsComponent } from './dashboard-tickets.component';

describe('DashboardTicketsComponent', () => {
  let component: DashboardTicketsComponent;
  let fixture: ComponentFixture<DashboardTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
