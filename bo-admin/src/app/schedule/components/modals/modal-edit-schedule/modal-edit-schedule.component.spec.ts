import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalEditScheduleComponent } from "./modal-edit-schedule.component";

describe('ModalEditScheduleComponent', () => {
    let component: ModalEditScheduleComponent;
    let fixture: ComponentFixture<ModalEditScheduleComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ModalEditScheduleComponent]
      });
      fixture = TestBed.createComponent(ModalEditScheduleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });