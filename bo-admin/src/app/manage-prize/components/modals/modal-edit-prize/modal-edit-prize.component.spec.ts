import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditPrizeComponent } from './modal-edit-prize.component';

describe('ModalEditPrizeComponent', () => {
  let component: ModalEditPrizeComponent;
  let fixture: ComponentFixture<ModalEditPrizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalEditPrizeComponent]
    });
    fixture = TestBed.createComponent(ModalEditPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
