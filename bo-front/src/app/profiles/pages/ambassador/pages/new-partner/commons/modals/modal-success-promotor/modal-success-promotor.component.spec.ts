import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuccessPromotorComponent } from './modal-success-promotor.component';

describe('ModalSuccessPromotorComponent', () => {
  let component: ModalSuccessPromotorComponent;
  let fixture: ComponentFixture<ModalSuccessPromotorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalSuccessPromotorComponent]
    });
    fixture = TestBed.createComponent(ModalSuccessPromotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
