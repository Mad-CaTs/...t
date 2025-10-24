import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAccountTreePlacementComponent } from './table-account-tree-placement.component';

describe('TableAccountTreePlacementComponent', () => {
  let component: TableAccountTreePlacementComponent;
  let fixture: ComponentFixture<TableAccountTreePlacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAccountTreePlacementComponent]
    });
    fixture = TestBed.createComponent(TableAccountTreePlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
