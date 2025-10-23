import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalAffiliatesComponent } from './national-affiliates.component';

describe('NationalAffiliatesComponent', () => {
  let component: NationalAffiliatesComponent;
  let fixture: ComponentFixture<NationalAffiliatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NationalAffiliatesComponent]
    });
    fixture = TestBed.createComponent(NationalAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
