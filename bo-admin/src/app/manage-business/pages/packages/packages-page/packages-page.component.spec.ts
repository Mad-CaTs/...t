import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesPageComponent } from './packages-page.component';

describe('PackagesPageComponent', () => {
  let component: PackagesPageComponent;
  let fixture: ComponentFixture<PackagesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PackagesPageComponent]
    });
    fixture = TestBed.createComponent(PackagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
