import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCommissionCommissionTypeComponent } from './generate-commission-commission-type.component';

describe('GenerateCommissionCommissionTypeComponent', () => {
  let component: GenerateCommissionCommissionTypeComponent;
  let fixture: ComponentFixture<GenerateCommissionCommissionTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateCommissionCommissionTypeComponent]
    });
    fixture = TestBed.createComponent(GenerateCommissionCommissionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
