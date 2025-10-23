import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAddPrizeComponent } from './modal-add-prize.component';

describe('ModalAddPrizeComponent', () => {
  let component: ModalAddPrizeComponent;
  let fixture: ComponentFixture<ModalAddPrizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalAddPrizeComponent]
    });
    fixture = TestBed.createComponent(ModalAddPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
