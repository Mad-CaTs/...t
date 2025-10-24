import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLocationComponent } from './modal-location.component';

describe('ModalLocationComponent', () => {
  let component: ModalLocationComponent;
  let fixture: ComponentFixture<ModalLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalLocationComponent]
    });
    fixture = TestBed.createComponent(ModalLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
