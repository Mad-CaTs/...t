import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRechargePaypalComponent } from './modal-recharge-paypal.component';

describe('ModalRechargePaypalComponent', () => {
  let component: ModalRechargePaypalComponent;
  let fixture: ComponentFixture<ModalRechargePaypalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRechargePaypalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalRechargePaypalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
