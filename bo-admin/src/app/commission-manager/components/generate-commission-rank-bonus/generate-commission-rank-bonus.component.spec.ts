import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCommissionRankBonusComponent } from './generate-commission-rank-bonus.component';

describe('GenerateCommissionRankBonusComponent', () => {
  let component: GenerateCommissionRankBonusComponent;
  let fixture: ComponentFixture<GenerateCommissionRankBonusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateCommissionRankBonusComponent]
    });
    fixture = TestBed.createComponent(GenerateCommissionRankBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
