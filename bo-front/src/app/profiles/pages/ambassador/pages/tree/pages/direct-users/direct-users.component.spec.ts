import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementComponent } from './direct-users.component';

describe('PlacementComponent', () => {
  let component: PlacementComponent;
  let fixture: ComponentFixture<PlacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementComponent]
    });
    fixture = TestBed.createComponent(PlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
