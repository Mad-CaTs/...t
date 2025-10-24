import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRewardsCardComponent } from './my-rewards-card.component';

describe('MyRewardsCardComponent', () => {
  let component: MyRewardsCardComponent;
  let fixture: ComponentFixture<MyRewardsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRewardsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyRewardsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
