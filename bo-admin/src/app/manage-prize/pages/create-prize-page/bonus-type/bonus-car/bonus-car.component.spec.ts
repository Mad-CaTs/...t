import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonusCarComponent } from './bonus-car.component';

describe('BonusCarComponent', () => {
  let component: BonusCarComponent;
  let fixture: ComponentFixture<BonusCarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BonusCarComponent]
    });
    fixture = TestBed.createComponent(BonusCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
