import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryCreationModalComponent } from './beneficiary-creation-modal.component';

describe('BeneficiaryCreationModalComponent', () => {
  let component: BeneficiaryCreationModalComponent;
  let fixture: ComponentFixture<BeneficiaryCreationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BeneficiaryCreationModalComponent]
    });
    fixture = TestBed.createComponent(BeneficiaryCreationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
