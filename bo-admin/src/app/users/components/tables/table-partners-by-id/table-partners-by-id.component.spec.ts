import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePartnersByIdComponent } from './table-partners-by-id.component';

describe('TablePartnersByIdComponent', () => {
  let component: TablePartnersByIdComponent;
  let fixture: ComponentFixture<TablePartnersByIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablePartnersByIdComponent]
    });
    fixture = TestBed.createComponent(TablePartnersByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
