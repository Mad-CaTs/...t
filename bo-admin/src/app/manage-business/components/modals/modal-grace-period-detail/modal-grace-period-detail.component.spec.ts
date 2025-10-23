import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalGracePeriodDetailComponent } from './modal-grace-period-detail.component';


describe('ModalGracePeriodDetailComponent', () => {
  let component: ModalGracePeriodDetailComponent;
  let fixture: ComponentFixture<ModalGracePeriodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalGracePeriodDetailComponent]
    });
    fixture = TestBed.createComponent(ModalGracePeriodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
