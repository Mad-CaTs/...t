import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalProcessRequestsComponent } from './legal-process-requests.component';

describe('LegalProcessRequestsComponent', () => {
  let component: LegalProcessRequestsComponent;
  let fixture: ComponentFixture<LegalProcessRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalProcessRequestsComponent]
    });
    fixture = TestBed.createComponent(LegalProcessRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
