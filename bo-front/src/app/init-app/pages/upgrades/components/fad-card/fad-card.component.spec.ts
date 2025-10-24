import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FadCardComponent } from './fad-card.component';

describe('FadCardComponent', () => {
  let component: FadCardComponent;
  let fixture: ComponentFixture<FadCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FadCardComponent]
    });
    fixture = TestBed.createComponent(FadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
