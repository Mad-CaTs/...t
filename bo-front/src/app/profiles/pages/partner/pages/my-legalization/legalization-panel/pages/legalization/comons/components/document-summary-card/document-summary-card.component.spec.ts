import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSummaryCardComponent } from './document-summary-card.component';

describe('DocumentSummaryCardComponent', () => {
  let component: DocumentSummaryCardComponent;
  let fixture: ComponentFixture<DocumentSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentSummaryCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
