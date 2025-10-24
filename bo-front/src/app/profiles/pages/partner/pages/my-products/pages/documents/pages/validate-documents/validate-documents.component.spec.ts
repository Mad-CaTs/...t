import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateDocumentsComponent } from './validate-documents.component';

describe('ValidateDocumentsComponent', () => {
  let component: ValidateDocumentsComponent;
  let fixture: ComponentFixture<ValidateDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidateDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
