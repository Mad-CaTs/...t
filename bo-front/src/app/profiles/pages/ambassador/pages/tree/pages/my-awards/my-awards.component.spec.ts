import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAwardsComponent } from './my-awards.component';

describe('MyAwardsComponent', () => {
  let component: MyAwardsComponent;
  let fixture: ComponentFixture<MyAwardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAwardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
