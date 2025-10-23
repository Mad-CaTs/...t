import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMassiveValidatorComponent } from './modal-massive-validator.component';

describe('ModalMassiveValidatorComponent', () => {
  let component: ModalMassiveValidatorComponent;
  let fixture: ComponentFixture<ModalMassiveValidatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalMassiveValidatorComponent]
    });
    fixture = TestBed.createComponent(ModalMassiveValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
