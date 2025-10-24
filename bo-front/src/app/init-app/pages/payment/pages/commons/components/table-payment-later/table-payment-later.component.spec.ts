import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablePaymentLaterComponent } from './table-payment-later.component';


describe('TablePaymentLaterComponent', () => {
  let component: TablePaymentLaterComponent;
  let fixture: ComponentFixture<TablePaymentLaterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePaymentLaterComponent]
    });
    fixture = TestBed.createComponent(TablePaymentLaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
