import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUnplacementComponent } from './modal-unplacement.component';

describe('ModalUnplacementComponent', () => {
  let component: ModalUnplacementComponent;
  let fixture: ComponentFixture<ModalUnplacementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUnplacementComponent]
    });
    fixture = TestBed.createComponent(ModalUnplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
