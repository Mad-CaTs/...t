import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResortMembershipCardsComponent } from './resort-membership-cards.component';

describe('ResortMembershipCardsComponent', () => {
  let component: ResortMembershipCardsComponent;
  let fixture: ComponentFixture<ResortMembershipCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResortMembershipCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResortMembershipCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
