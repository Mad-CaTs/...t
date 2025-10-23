import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutChangeTypeComponent } from './layout-change-type.component';

describe('LayoutChangeTypeComponent', () => {
  let component: LayoutChangeTypeComponent;
  let fixture: ComponentFixture<LayoutChangeTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LayoutChangeTypeComponent]
    });
    fixture = TestBed.createComponent(LayoutChangeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
