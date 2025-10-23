import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalToolUpsertComponent } from './modal-tool-upsert.component';

describe('ModalToolUpsertComponent', () => {
  let component: ModalToolUpsertComponent;
  let fixture: ComponentFixture<ModalToolUpsertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalToolUpsertComponent]
    });
    fixture = TestBed.createComponent(ModalToolUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
