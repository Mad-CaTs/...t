import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailCreateComponent } from './modal-detail-create.component';


describe('ModalDetailCreateComponent', () => {
  let component: ModalDetailCreateComponent;
  let fixture: ComponentFixture<ModalDetailCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalDetailCreateComponent]
    });
    fixture = TestBed.createComponent(ModalDetailCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
