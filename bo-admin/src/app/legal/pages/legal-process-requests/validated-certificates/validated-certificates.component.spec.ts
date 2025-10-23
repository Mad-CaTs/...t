import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedCertificatesComponent } from './validated-certificates.component';

describe('ValidatedCertificatesComponent', () => {
  let component: ValidatedCertificatesComponent;
  let fixture: ComponentFixture<ValidatedCertificatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatedCertificatesComponent]
    });
    fixture = TestBed.createComponent(ValidatedCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
