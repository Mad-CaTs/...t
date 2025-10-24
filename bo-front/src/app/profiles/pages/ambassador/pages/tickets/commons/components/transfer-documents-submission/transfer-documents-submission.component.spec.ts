import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDocumentsSubmissionComponent } from './transfer-documents-submission.component';

describe('TransferDocumentsSubmissionComponent', () => {
  let component: TransferDocumentsSubmissionComponent;
  let fixture: ComponentFixture<TransferDocumentsSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferDocumentsSubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferDocumentsSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
