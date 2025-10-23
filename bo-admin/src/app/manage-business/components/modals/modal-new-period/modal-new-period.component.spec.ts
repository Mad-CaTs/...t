import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalNewPeriodComponent } from './modal-new-period.component';


describe('ModalNewPeriodComponent', () => {
  let component: ModalNewPeriodComponent;
  let fixture: ComponentFixture<ModalNewPeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalNewPeriodComponent]
    });
    fixture = TestBed.createComponent(ModalNewPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
