import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalToolImageComponent } from './modal-tool-image.component';

describe('ModalToolImageComponent', () => {
  let component: ModalToolImageComponent;
  let fixture: ComponentFixture<ModalToolImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalToolImageComponent]
    });
    fixture = TestBed.createComponent(ModalToolImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
