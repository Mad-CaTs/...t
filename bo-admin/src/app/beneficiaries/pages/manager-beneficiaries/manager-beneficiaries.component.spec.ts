import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerBeneficiariesComponent } from './manager-beneficiaries.component';

describe('ManagerBeneficiariesComponent', () => {
  let component: ManagerBeneficiariesComponent;
  let fixture: ComponentFixture<ManagerBeneficiariesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagerBeneficiariesComponent]
    });
    fixture = TestBed.createComponent(ManagerBeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
