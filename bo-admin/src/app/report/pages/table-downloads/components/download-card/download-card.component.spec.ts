import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCardComponent } from './download-card.component';

describe('DownloadCardComponent', () => {
  let component: DownloadCardComponent;
  let fixture: ComponentFixture<DownloadCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DownloadCardComponent]
    });
    fixture = TestBed.createComponent(DownloadCardComponent);
    component = fixture.componentInstance;
    
    // Mock input
    component.card = {
      id: 'test',
      title: 'Test Title',
      description: 'Test Description',
      icon: 'description',
      filterType: 'date',
      isDownloading: false,
      startDate: null,
      endDate: null
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});