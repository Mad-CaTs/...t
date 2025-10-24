import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAccountOrganizationManagerComponent } from './table-account-organization-manager.component';

describe('TableAccountOrganizationManagerComponent', () => {
  let component: TableAccountOrganizationManagerComponent;
  let fixture: ComponentFixture<TableAccountOrganizationManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAccountOrganizationManagerComponent]
    });
    fixture = TestBed.createComponent(TableAccountOrganizationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
