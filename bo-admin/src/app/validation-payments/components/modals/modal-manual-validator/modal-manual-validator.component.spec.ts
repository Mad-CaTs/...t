import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalManualValidatorComponent } from './modal-manual-validator.component';

describe('ModalManualValidatorComponent', () => {
  let component: ModalManualValidatorComponent;
  let fixture: ComponentFixture<ModalManualValidatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalManualValidatorComponent]
    });
    fixture = TestBed.createComponent(ModalManualValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
