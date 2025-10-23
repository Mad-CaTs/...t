import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPromoCodeAddComponent } from './modal-promo-code-add.component';

describe('ModalPromoCodeAddComponent', () => {
  let component: ModalPromoCodeAddComponent;
  let fixture: ComponentFixture<ModalPromoCodeAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalPromoCodeAddComponent]
    });
    fixture = TestBed.createComponent(ModalPromoCodeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
