import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementDashboardComponent } from './management-dashboard.component';


describe('ManagementDashboardComponent', () => {
  let component: ManagementDashboardComponent
  let fixture: ComponentFixture<ManagementDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementDashboardComponent]
    });
    fixture = TestBed.createComponent(ManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
