import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartnerSelectPackageComponent } from './new-partner-select-package.component';

describe('NewPartnerSelectPackageComponent', () => {
  let component: NewPartnerSelectPackageComponent;
  let fixture: ComponentFixture<NewPartnerSelectPackageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewPartnerSelectPackageComponent]
    });
    fixture = TestBed.createComponent(NewPartnerSelectPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
