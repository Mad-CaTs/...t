import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpsertNewsComponent } from './modal-upsert-news.component';

describe('ModalUpsertNewsComponent', () => {
  let component: ModalUpsertNewsComponent;
  let fixture: ComponentFixture<ModalUpsertNewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalUpsertNewsComponent]
    });
    fixture = TestBed.createComponent(ModalUpsertNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
