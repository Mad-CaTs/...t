import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveBrandsComponent } from './exclusive-brands.component';

describe('ExclusiveBrandsComponent', () => {
  let component: ExclusiveBrandsComponent;
  let fixture: ComponentFixture<ExclusiveBrandsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExclusiveBrandsComponent]
    });
    fixture = TestBed.createComponent(ExclusiveBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
