import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPackageEditComponent } from './modal-package-edit.component';

describe('ModalPackageEditComponent', () => {
  let component: ModalPackageEditComponent;
  let fixture: ComponentFixture<ModalPackageEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPackageEditComponent]
    });
    fixture = TestBed.createComponent(ModalPackageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
