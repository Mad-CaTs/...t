import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailCarComponent } from './modal-detail-car.component';

describe('ModalDetailCarComponent', () => {
  let component: ModalDetailCarComponent;
  let fixture: ComponentFixture<ModalDetailCarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalDetailCarComponent]
    });
    fixture = TestBed.createComponent(ModalDetailCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
