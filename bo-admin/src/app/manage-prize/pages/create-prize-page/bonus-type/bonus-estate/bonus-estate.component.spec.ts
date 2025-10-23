import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonusEstateComponent } from './bonus-estate.component';

describe('BonusEstateComponent', () => {
  let component: BonusEstateComponent;
  let fixture: ComponentFixture<BonusEstateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BonusEstateComponent]
    });
    fixture = TestBed.createComponent(BonusEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
