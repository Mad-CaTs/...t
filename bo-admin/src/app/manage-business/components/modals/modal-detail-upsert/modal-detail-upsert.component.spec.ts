import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailUpsertComponent } from './modal-detail-upsert.component';

describe('ModalDetailUpsertComponent', () => {
  let component: ModalDetailUpsertComponent;
  let fixture: ComponentFixture<ModalDetailUpsertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalDetailUpsertComponent]
    });
    fixture = TestBed.createComponent(ModalDetailUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
