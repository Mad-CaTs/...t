import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoordinatorPanelPageComponent } from './coordinator-panel-page.component';


describe('CoordinatorPanelPageComponent', () => {
  let component: CoordinatorPanelPageComponent;
  let fixture: ComponentFixture<CoordinatorPanelPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordinatorPanelPageComponent]
    });
    fixture = TestBed.createComponent(CoordinatorPanelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
