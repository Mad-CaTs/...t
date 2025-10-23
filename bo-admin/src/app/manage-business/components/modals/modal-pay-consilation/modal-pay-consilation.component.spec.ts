import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPayConsilationComponent } from './modal-pay-consilation.component';

describe('ModalPayConsilationComponent', () => {
  let component: ModalPayConsilationComponent;
  let fixture: ComponentFixture<ModalPayConsilationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPayConsilationComponent]
    });
    fixture = TestBed.createComponent(ModalPayConsilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
