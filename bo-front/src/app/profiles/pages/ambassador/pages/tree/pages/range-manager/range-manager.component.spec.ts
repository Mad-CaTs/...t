import { ComponentFixture, TestBed } from '@angular/core/testing';
import RangeManagerComponent from './range-manager.component';

describe('RangeManagerComponent', () => {
  let component: RangeManagerComponent;
  let fixture: ComponentFixture<RangeManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangeManagerComponent]
    });
    fixture = TestBed.createComponent(RangeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
