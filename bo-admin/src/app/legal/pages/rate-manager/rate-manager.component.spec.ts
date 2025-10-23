import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateManagerComponent } from './rate-manager.component';

describe('RateManagerComponent', () => {
  let component: RateManagerComponent;
  let fixture: ComponentFixture<RateManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RateManagerComponent]
    });
    fixture = TestBed.createComponent(RateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
