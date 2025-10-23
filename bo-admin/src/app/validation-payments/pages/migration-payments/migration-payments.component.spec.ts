import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationPaymentsComponent } from './migration-payments.component';

describe('MigrationPaymentsComponent', () => {
  let component: MigrationPaymentsComponent;
  let fixture: ComponentFixture<MigrationPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MigrationPaymentsComponent]
    });
    fixture = TestBed.createComponent(MigrationPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
