import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedComponent } from './detailed.component';

describe('DetailedComponent', () => {
  let component: DetailedComponent;
  let fixture: ComponentFixture<DetailedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetailedComponent]
    });
    fixture = TestBed.createComponent(DetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
