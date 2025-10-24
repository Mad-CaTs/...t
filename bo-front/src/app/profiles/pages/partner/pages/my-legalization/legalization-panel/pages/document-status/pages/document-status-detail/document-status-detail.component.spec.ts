import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentStatusDetailComponent } from './document-status-detail.component';

describe('DocumentStatusDetailComponent', () => {
  let component: DocumentStatusDetailComponent;
  let fixture: ComponentFixture<DocumentStatusDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentStatusDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
