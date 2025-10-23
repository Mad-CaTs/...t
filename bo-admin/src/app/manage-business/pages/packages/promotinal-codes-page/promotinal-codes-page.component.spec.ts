import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotinalCodesPageComponent } from './promotinal-codes-page.component';

describe('PromotinalCodesPageComponent', () => {
  let component: PromotinalCodesPageComponent;
  let fixture: ComponentFixture<PromotinalCodesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotinalCodesPageComponent]
    });
    fixture = TestBed.createComponent(PromotinalCodesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
