import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPackageCreateComponent } from './modal-package-create.component';

describe('ModalPackageCreateComponent', () => {
  let component: ModalPackageCreateComponent;
  let fixture: ComponentFixture<ModalPackageCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPackageCreateComponent]
    });
    fixture = TestBed.createComponent(ModalPackageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
