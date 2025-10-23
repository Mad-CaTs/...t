import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipAffiliatesComponent } from './membership-affiliates.component';

describe('MembershipAffiliatesComponent', () => {
  let component: MembershipAffiliatesComponent;
  let fixture: ComponentFixture<MembershipAffiliatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembershipAffiliatesComponent]
    });
    fixture = TestBed.createComponent(MembershipAffiliatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
