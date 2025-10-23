import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableManagerBeneficiariesComponent } from './table-manager-beneficiaries.component';

describe('TableManagerBeneficiariesComponent', () => {
  let component: TableManagerBeneficiariesComponent;
  let fixture: ComponentFixture<TableManagerBeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableManagerBeneficiariesComponent]
    });
    fixture = TestBed.createComponent(TableManagerBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
