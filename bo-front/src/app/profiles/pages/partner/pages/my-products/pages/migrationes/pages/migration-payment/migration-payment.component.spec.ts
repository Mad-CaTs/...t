import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationPaymentComponent } from './migration-payment.component';

describe('MigrationPaymentComponent', () => {
  let component: MigrationPaymentComponent;
  let fixture: ComponentFixture<MigrationPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigrationPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MigrationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
