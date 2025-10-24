import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FadComponent } from './fad.component';

describe('FadComponent', () => {
  let component: FadComponent;
  let fixture: ComponentFixture<FadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FadComponent]
    });
    fixture = TestBed.createComponent(FadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
