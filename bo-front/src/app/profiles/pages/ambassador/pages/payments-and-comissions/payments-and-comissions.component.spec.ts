import { ComponentFixture, TestBed } from '@angular/core/testing';
import PaymentsAndComissionsComponent from './payments-and-comissions.component';


describe('PaymentsAndComissionsComponent', () => {
  let component: PaymentsAndComissionsComponent;
  let fixture: ComponentFixture<PaymentsAndComissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsAndComissionsComponent]
    });
    fixture = TestBed.createComponent(PaymentsAndComissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
