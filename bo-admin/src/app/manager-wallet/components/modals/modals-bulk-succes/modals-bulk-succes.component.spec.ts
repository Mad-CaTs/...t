import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsBulkSuccesComponent } from './modals-bulk-succes.component';

describe('ModalsBulkSuccesComponent', () => {
  let component: ModalsBulkSuccesComponent;
  let fixture: ComponentFixture<ModalsBulkSuccesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalsBulkSuccesComponent]
    });
    fixture = TestBed.createComponent(ModalsBulkSuccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
