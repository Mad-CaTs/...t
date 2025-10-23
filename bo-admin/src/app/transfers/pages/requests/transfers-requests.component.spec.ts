import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransfersRequestsComponent } from './transfers-requests.component';


describe('InitialPaymentsComponent', () => {
  let component: TransfersRequestsComponent;
  let fixture: ComponentFixture<TransfersRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TransfersRequestsComponent]
    });
    fixture = TestBed.createComponent(TransfersRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
