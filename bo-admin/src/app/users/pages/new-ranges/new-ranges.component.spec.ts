import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRangesComponent } from './new-ranges.component';

describe('NewRangesComponent', () => {
  let component: NewRangesComponent;
  let fixture: ComponentFixture<NewRangesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewRangesComponent]
    });
    fixture = TestBed.createComponent(NewRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
