import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalizationPanelComponent } from './legalization-panel.component';

describe('LegalizationPanelComponent', () => {
  let component: LegalizationPanelComponent;
  let fixture: ComponentFixture<LegalizationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalizationPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LegalizationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
