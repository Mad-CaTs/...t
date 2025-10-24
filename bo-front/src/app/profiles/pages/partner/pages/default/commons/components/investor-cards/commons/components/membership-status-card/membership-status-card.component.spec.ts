import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipStatusCardComponent } from './membership-status-card.component';

describe('MembershipStatusCardComponent', () => {
  let component: MembershipStatusCardComponent;
  let fixture: ComponentFixture<MembershipStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipStatusCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembershipStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
