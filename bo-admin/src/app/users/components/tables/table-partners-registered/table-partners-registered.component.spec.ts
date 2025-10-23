import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePartnersRegisteredComponent } from './table-partners-registered.component';

describe('TablePartnersRegisteredComponent', () => {
  let component: TablePartnersRegisteredComponent;
  let fixture: ComponentFixture<TablePartnersRegisteredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePartnersRegisteredComponent]
    });
    fixture = TestBed.createComponent(TablePartnersRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
