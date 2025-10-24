import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorderedTableComponent } from './bordered-table.component';

describe('BorderedTableComponent', () => {
  let component: BorderedTableComponent;
  let fixture: ComponentFixture<BorderedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorderedTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BorderedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
