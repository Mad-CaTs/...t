import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserUpsertComponent } from './modal-user-upsert.component';

describe('ModalUserUpsertComponent', () => {
  let component: ModalUserUpsertComponent;
  let fixture: ComponentFixture<ModalUserUpsertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalUserUpsertComponent]
    });
    fixture = TestBed.createComponent(ModalUserUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
