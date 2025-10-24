import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAccountTreeSponsorshipListComponent } from './table-account-tree-sponsorship-list.component';

describe('TableAccountTreeSponsorshipListComponent', () => {
  let component: TableAccountTreeSponsorshipListComponent;
  let fixture: ComponentFixture<TableAccountTreeSponsorshipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAccountTreeSponsorshipListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableAccountTreeSponsorshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
