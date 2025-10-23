import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFamilyEditComponent } from './modal-family-edit.component';

describe('ModalFamilyEditComponent', () => {
  let component: ModalFamilyEditComponent;
  let fixture: ComponentFixture<ModalFamilyEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalFamilyEditComponent]
    });
    fixture = TestBed.createComponent(ModalFamilyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
