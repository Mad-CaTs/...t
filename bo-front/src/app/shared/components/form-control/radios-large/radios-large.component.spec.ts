import { ComponentFixture, TestBed } from '@angular/core/testing';
import RadiosLargeComponent from './radios-large.component';

describe('RadiosLargeComponent', () => {
  let component: RadiosLargeComponent;
  let fixture: ComponentFixture<RadiosLargeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RadiosLargeComponent]
    });
    fixture = TestBed.createComponent(RadiosLargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
