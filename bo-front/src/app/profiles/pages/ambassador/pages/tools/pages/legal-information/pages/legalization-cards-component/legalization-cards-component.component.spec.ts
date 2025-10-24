import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalizationCardsComponentComponent } from './legalization-cards-component.component';

describe('LegalizationCardsComponentComponent', () => {
  let component: LegalizationCardsComponentComponent;
  let fixture: ComponentFixture<LegalizationCardsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalizationCardsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalizationCardsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
