import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditRecordComponent } from './audit-record.component';

describe('AuditRecordComponent', () => {
  let component: AuditRecordComponent;
  let fixture: ComponentFixture<AuditRecordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditRecordComponent]
    });
    fixture = TestBed.createComponent(AuditRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
