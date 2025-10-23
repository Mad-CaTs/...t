import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalEditStatusComponent } from "./modal-edit-status.component";

describe('ModalEditStatusComponent', () => {
    let component: ModalEditStatusComponent;
    let fixture: ComponentFixture<ModalEditStatusComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ModalEditStatusComponent]
      });
      fixture = TestBed.createComponent(ModalEditStatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });