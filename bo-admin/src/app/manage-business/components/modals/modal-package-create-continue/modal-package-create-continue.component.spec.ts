import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalPackageCreateContinueComponent } from './modal-package-create-continue.component';


describe('ModalDetailUpsertComponent', () => {
  let component: ModalPackageCreateContinueComponent;
  let fixture: ComponentFixture<ModalPackageCreateContinueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPackageCreateContinueComponent]
    });
    fixture = TestBed.createComponent(ModalPackageCreateContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
