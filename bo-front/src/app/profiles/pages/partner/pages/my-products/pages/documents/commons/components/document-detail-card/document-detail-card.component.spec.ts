import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailCardComponent } from './document-detail-card.component';

describe('DocumentDetailCardComponent', () => {
  let component: DocumentDetailCardComponent;
  let fixture: ComponentFixture<DocumentDetailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDetailCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
