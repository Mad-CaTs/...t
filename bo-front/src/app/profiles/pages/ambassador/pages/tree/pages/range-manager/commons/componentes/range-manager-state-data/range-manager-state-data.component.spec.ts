import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeManagerStateDataComponent } from './range-manager-state-data.component';

describe('RangeManagerStateDataComponent', () => {
  let component: RangeManagerStateDataComponent;
  let fixture: ComponentFixture<RangeManagerStateDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeManagerStateDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RangeManagerStateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
