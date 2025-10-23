import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditVehicleInsuranceComponent } from './modal-edit-vehicle-insurance.component';

describe('ModalEditVehicleInsuranceComponent', () => {
  let component: ModalEditVehicleInsuranceComponent;
  let fixture: ComponentFixture<ModalEditVehicleInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditVehicleInsuranceComponent]
    });
    fixture = TestBed.createComponent(ModalEditVehicleInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
