import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsBulkNotificationComponent } from './modals-bulk-notification.component';

describe('ModalsBulkNotificationComponent', () => {
  let component: ModalsBulkNotificationComponent;
  let fixture: ComponentFixture<ModalsBulkNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalsBulkNotificationComponent]
    });
    fixture = TestBed.createComponent(ModalsBulkNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
