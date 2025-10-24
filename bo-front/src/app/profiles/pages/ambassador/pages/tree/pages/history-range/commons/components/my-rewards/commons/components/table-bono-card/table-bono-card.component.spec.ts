import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableBonoCardComponent } from './table-bono-card.component';


describe('TableAccountTreeActivationManagerComponent', () => {
  let component: TableBonoCardComponent;
  let fixture: ComponentFixture<TableBonoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableBonoCardComponent]
    });
    fixture = TestBed.createComponent(TableBonoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
