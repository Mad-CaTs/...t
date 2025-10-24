import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeAutoBonusDocumentComponent } from './see-auto-bonus-document.component';

describe('SeeAutoBonusDocumentComponent', () => {
  let component: SeeAutoBonusDocumentComponent;
  let fixture: ComponentFixture<SeeAutoBonusDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeeAutoBonusDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeeAutoBonusDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
