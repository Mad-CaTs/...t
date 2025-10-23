import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ValidateDocsComponent } from "./validate-docs.component";

describe('ValidateDocsComponent', () => {
    let component: ValidateDocsComponent;
    let fixture: ComponentFixture<ValidateDocsComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ValidateDocsComponent]
      });
      fixture = TestBed.createComponent(ValidateDocsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });