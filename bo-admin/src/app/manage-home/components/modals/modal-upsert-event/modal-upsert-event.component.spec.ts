import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpsertEventComponent } from './modal-upsert-event.component';

describe('ModalUpsertEventComponent', () => {
  let component: ModalUpsertEventComponent;
  let fixture: ComponentFixture<ModalUpsertEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalUpsertEventComponent]
    });
    fixture = TestBed.createComponent(ModalUpsertEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
