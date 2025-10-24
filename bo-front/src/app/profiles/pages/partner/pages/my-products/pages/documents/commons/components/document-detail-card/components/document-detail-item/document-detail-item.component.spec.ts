import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailItemComponent } from './document-detail-item.component';

describe('DocumentDetailItemComponent', () => {
  let component: DocumentDetailItemComponent;
  let fixture: ComponentFixture<DocumentDetailItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDetailItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentDetailItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
