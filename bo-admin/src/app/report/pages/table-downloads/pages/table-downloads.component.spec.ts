import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDownloadsComponent } from './table-downloads.component';

describe('TableDownloadsComponent', () => {
  let component: TableDownloadsComponent;
  let fixture: ComponentFixture<TableDownloadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableDownloadsComponent]
    });
    fixture = TestBed.createComponent(TableDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});