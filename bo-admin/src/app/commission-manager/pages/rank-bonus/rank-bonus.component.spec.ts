import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankBonusComponent } from './rank-bonus.component';

describe('RankBonusComponent', () => {
  let component: RankBonusComponent;
  let fixture: ComponentFixture<RankBonusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankBonusComponent]
    });
    fixture = TestBed.createComponent(RankBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
