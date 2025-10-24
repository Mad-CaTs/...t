import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorCardsComponent } from './investor-cards.component';

describe('InvestorCardsComponent', () => {
  let component: InvestorCardsComponent;
  let fixture: ComponentFixture<InvestorCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestorCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
