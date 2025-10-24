import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatComponent } from './bonus.component';

describe('StatComponent', () => {
  let component: StatComponent;
  let fixture: ComponentFixture<StatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatComponent]
    });
    fixture = TestBed.createComponent(StatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
