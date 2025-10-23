import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedContractsComponent } from './validated-contracts.component';

describe('ValidatedContractsComponent', () => {
  let component: ValidatedContractsComponent;
  let fixture: ComponentFixture<ValidatedContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatedContractsComponent]
    });
    fixture = TestBed.createComponent(ValidatedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
