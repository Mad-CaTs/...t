import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAmbassadorComponent } from './main-ambassador.component';

describe('MainAmbassadorComponent', () => {
  let component: MainAmbassadorComponent;
  let fixture: ComponentFixture<MainAmbassadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainAmbassadorComponent]
    });
    fixture = TestBed.createComponent(MainAmbassadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
