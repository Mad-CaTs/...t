import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocumentComponent } from './modal-document.component';

describe('ModalDocumentComponent', () => {
  let component: ModalDocumentComponent;
  let fixture: ComponentFixture<ModalDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
