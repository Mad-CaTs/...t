import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCoRequesterComponent } from './modal-co-requester.component';

describe('ModalCoRequesterComponent', () => {
  let component: ModalCoRequesterComponent;
  let fixture: ComponentFixture<ModalCoRequesterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalCoRequesterComponent]
    });
    fixture = TestBed.createComponent(ModalCoRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
