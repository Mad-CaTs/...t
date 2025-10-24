import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlacementComponent } from './modal-reactivacion.component';

describe('ModalPlacementComponent', () => {
  let component: ModalPlacementComponent;
  let fixture: ComponentFixture<ModalPlacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPlacementComponent]
    });
    fixture = TestBed.createComponent(ModalPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
