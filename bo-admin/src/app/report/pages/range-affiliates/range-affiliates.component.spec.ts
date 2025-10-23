import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeAffiliatesComponent } from './range-affiliates.component';

describe('RangeAffiliatesComponent', () => {
  let component: RangeAffiliatesComponent;
  let fixture: ComponentFixture<RangeAffiliatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangeAffiliatesComponent]
    });
    fixture = TestBed.createComponent(RangeAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
