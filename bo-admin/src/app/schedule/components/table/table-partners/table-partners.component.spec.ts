import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TablePartnersComponent } from "./table-partners.component";

describe('TablePartnersComponent', () => {
    let component: TablePartnersComponent;
    let fixture: ComponentFixture<TablePartnersComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TablePartnersComponent]
      });
      fixture = TestBed.createComponent(TablePartnersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });