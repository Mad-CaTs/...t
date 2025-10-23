import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPartnersRegisteredComponent } from './modal-partners-registered.component';

describe('ModalPartnersRegisteredComponent', () => {
  let component: ModalPartnersRegisteredComponent;
  let fixture: ComponentFixture<ModalPartnersRegisteredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPartnersRegisteredComponent]
    });
    fixture = TestBed.createComponent(ModalPartnersRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
