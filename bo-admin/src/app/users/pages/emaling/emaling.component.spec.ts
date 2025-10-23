import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmalingComponent } from './emaling.component';

describe('EmalingComponent', () => {
  let component: EmalingComponent;
  let fixture: ComponentFixture<EmalingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmalingComponent]
    });
    fixture = TestBed.createComponent(EmalingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
