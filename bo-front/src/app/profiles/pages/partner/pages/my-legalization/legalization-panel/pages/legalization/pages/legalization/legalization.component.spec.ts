import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalizationComponent } from './legalization.component';

describe('LegalizationComponent', () => {
  let component: LegalizationComponent;
  let fixture: ComponentFixture<LegalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
