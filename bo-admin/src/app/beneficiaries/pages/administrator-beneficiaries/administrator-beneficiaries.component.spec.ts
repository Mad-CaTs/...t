import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorBeneficiariesComponent } from './administrator-beneficiaries.component';

describe('AdministratorBeneficiariesComponent', () => {
  let component: AdministratorBeneficiariesComponent;
  let fixture: ComponentFixture<AdministratorBeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministratorBeneficiariesComponent]
    });
    fixture = TestBed.createComponent(AdministratorBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
