import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeManagerNavigationComponent } from './range-manager-navigation.component';

describe('RangeManagerNavigationComponent', () => {
  let component: RangeManagerNavigationComponent;
  let fixture: ComponentFixture<RangeManagerNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeManagerNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RangeManagerNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
