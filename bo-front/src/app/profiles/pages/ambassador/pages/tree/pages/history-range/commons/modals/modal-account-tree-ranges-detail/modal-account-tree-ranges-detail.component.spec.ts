import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAccountTreeRangesDetailComponent } from './modal-account-tree-ranges-detail.component';

describe('ModalAccountTreeRangesDetailComponent', () => {
  let component: ModalAccountTreeRangesDetailComponent;
  let fixture: ComponentFixture<ModalAccountTreeRangesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAccountTreeRangesDetailComponent]
    });
    fixture = TestBed.createComponent(ModalAccountTreeRangesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
