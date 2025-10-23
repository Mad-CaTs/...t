import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadsDashboardComponent } from './downloads-dashboard.component';

describe('DownloadsDashboardComponent', () => {
  let component: DownloadsDashboardComponent;
  let fixture: ComponentFixture<DownloadsDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DownloadsDashboardComponent]
    });
    fixture = TestBed.createComponent(DownloadsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});