import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonusTravelComponent } from './bonus-travel.component';

describe('BonusTravelComponent', () => {
  let component: BonusTravelComponent;
  let fixture: ComponentFixture<BonusTravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BonusTravelComponent]
    });
    fixture = TestBed.createComponent(BonusTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
