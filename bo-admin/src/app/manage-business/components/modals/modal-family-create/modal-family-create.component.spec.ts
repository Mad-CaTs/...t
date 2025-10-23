import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFamilyCreateComponent } from './modal-family-create.component';

describe('ModalFamilyCreateComponent', () => {
  let component: ModalFamilyCreateComponent;
  let fixture: ComponentFixture<ModalFamilyCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalFamilyCreateComponent]
    });
    fixture = TestBed.createComponent(ModalFamilyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
