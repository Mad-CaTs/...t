import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonTableComponent } from './common-table.component';

describe('CommonTableComponent', () => {
  let component: CommonTableComponent;
  let fixture: ComponentFixture<CommonTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonTableComponent]
    });
    fixture = TestBed.createComponent(CommonTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
