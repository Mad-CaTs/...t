import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdministratorBeneficiariesComponent } from './table-administrator-beneficiaries.component';

describe('TableAdministratorBeneficiariesComponent', () => {
  let component: TableAdministratorBeneficiariesComponent;
  let fixture: ComponentFixture<TableAdministratorBeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAdministratorBeneficiariesComponent]
    });
    fixture = TestBed.createComponent(TableAdministratorBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
