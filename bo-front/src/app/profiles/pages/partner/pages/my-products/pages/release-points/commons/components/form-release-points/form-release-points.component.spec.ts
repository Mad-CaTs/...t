import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReleasePointsComponent } from './form-release-points.component';

describe('FormReleasePointsComponent', () => {
  let component: FormReleasePointsComponent;
  let fixture: ComponentFixture<FormReleasePointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormReleasePointsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormReleasePointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
