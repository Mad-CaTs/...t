import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionTypeComponent } from './commission-type.component';

describe('CommissionTypeComponent', () => {
  let component: CommissionTypeComponent;
  let fixture: ComponentFixture<CommissionTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommissionTypeComponent]
    });
    fixture = TestBed.createComponent(CommissionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
