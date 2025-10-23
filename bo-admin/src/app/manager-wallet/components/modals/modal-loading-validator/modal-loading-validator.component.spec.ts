import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoadingValidatorComponent } from './modal-loading-validator.component';

describe('ModalLoadingValidatorComponent', () => {
  let component: ModalLoadingValidatorComponent;
  let fixture: ComponentFixture<ModalLoadingValidatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLoadingValidatorComponent]
    });
    fixture = TestBed.createComponent(ModalLoadingValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
