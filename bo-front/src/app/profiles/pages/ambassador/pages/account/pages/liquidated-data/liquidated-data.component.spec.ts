import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidatedDataComponent } from './liquidated-data.component';

describe('LiquidatedDataComponent', () => {
  let component: LiquidatedDataComponent;
  let fixture: ComponentFixture<LiquidatedDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidatedDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiquidatedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
