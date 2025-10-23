import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiquidationsRequestsComponent } from './liquidations-requests.component';


describe('LiquidationsRequestsComponent', () => {
  let component: LiquidationsRequestsComponent;
  let fixture: ComponentFixture<LiquidationsRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LiquidationsRequestsComponent]
    });
    fixture = TestBed.createComponent(LiquidationsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
