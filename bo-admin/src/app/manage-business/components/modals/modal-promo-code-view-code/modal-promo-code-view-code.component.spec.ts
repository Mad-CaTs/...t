import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPromoCodeViewCodeComponent } from './modal-promo-code-view-code.component';

describe('ModalPromoCodeViewCodeComponent', () => {
  let component: ModalPromoCodeViewCodeComponent;
  let fixture: ComponentFixture<ModalPromoCodeViewCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPromoCodeViewCodeComponent]
    });
    fixture = TestBed.createComponent(ModalPromoCodeViewCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
