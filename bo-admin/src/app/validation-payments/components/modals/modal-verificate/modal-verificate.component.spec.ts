import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerificateComponent } from './modal-verificate.component';

describe('ModalVerificateComponent', () => {
  let component: ModalVerificateComponent;
  let fixture: ComponentFixture<ModalVerificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalVerificateComponent]
    });
    fixture = TestBed.createComponent(ModalVerificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
