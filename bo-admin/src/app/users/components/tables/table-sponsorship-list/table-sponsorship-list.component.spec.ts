import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSponsorshipListComponent } from './table-sponsorship-list.component';

describe('TableSponsorshipListComponent', () => {
  let component: TableSponsorshipListComponent;
  let fixture: ComponentFixture<TableSponsorshipListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSponsorshipListComponent]
    });
    fixture = TestBed.createComponent(TableSponsorshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
