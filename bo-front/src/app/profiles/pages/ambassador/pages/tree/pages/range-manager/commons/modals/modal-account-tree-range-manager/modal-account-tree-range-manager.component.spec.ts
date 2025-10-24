import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAccountTreeRangeManagerComponent } from './modal-account-tree-range-manager.component';

describe('ModalAccountTreeRangeManagerComponent', () => {
  let component: ModalAccountTreeRangeManagerComponent;
  let fixture: ComponentFixture<ModalAccountTreeRangeManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAccountTreeRangeManagerComponent]
    });
    fixture = TestBed.createComponent(ModalAccountTreeRangeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
