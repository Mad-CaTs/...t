import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailTravelComponent } from './modal-detail-travel.component';

describe('ModalDetailTravelComponent', () => {
  let component: ModalDetailTravelComponent;
  let fixture: ComponentFixture<ModalDetailTravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalDetailTravelComponent]
    });
    fixture = TestBed.createComponent(ModalDetailTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
