import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalEditScheduleComissionComponent } from "./modal-edit-schedule-commission.component";

describe('ModalEditScheduleComissionComponent', () => {
    let component: ModalEditScheduleComissionComponent;
    let fixture: ComponentFixture<ModalEditScheduleComissionComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ModalEditScheduleComissionComponent]
      });
      fixture = TestBed.createComponent(ModalEditScheduleComissionComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });