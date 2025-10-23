import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalGracePeriodDetailEditComponent } from './modal-grace-period-detail-edit.component';


describe('ModalGracePeriodDetailEditComponent', () => {
  let component: ModalGracePeriodDetailEditComponent;
  let fixture: ComponentFixture<ModalGracePeriodDetailEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalGracePeriodDetailEditComponent]
    });
    fixture = TestBed.createComponent(ModalGracePeriodDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
