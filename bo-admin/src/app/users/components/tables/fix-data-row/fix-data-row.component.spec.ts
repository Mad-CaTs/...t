import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixDataRowComponent } from './fix-data-row.component';

describe('FixDataRowComponent', () => {
  let component: FixDataRowComponent;
  let fixture: ComponentFixture<FixDataRowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixDataRowComponent]
    });
    fixture = TestBed.createComponent(FixDataRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
