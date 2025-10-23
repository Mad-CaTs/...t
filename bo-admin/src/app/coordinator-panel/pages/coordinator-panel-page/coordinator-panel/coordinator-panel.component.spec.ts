import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoordinatorPanelComponent } from "./coordinator-panel.component";

describe('CoordinatorPanelComponent', () => {
    let component: CoordinatorPanelComponent;
    let fixture: ComponentFixture<CoordinatorPanelComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CoordinatorPanelComponent]
      });
      fixture = TestBed.createComponent(CoordinatorPanelComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });