import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDashboardHeaderComponent } from './profile-dashboard-header.component';

describe('ProfileDashboardHeaderComponent', () => {
  let component: ProfileDashboardHeaderComponent;
  let fixture: ComponentFixture<ProfileDashboardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDashboardHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileDashboardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
