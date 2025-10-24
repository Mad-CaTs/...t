import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAccountTreeActivationManagerComponent } from './table-account-tree-activation-manager.component';

describe('TableAccountTreeActivationManagerComponent', () => {
  let component: TableAccountTreeActivationManagerComponent;
  let fixture: ComponentFixture<TableAccountTreeActivationManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAccountTreeActivationManagerComponent]
    });
    fixture = TestBed.createComponent(TableAccountTreeActivationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
