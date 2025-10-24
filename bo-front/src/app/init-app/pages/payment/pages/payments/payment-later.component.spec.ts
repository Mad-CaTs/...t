import { ComponentFixture, TestBed } from "@angular/core/testing";
import PaymentLaterComponent from "./payment-later.component";

describe('PaymentLaterComponent', () => {
    let component: PaymentLaterComponent;
    let fixture: ComponentFixture<PaymentLaterComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PaymentLaterComponent]
      });
      fixture = TestBed.createComponent(PaymentLaterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });