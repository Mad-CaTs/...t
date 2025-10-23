import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSponsorshipRangoPersonalizadoComponent } from './modal-sponsorship-rango-personalizado.component';

describe('ModalSponsorshipRangoPersonalizadoComponent', () => {
  let component: ModalSponsorshipRangoPersonalizadoComponent;
  let fixture: ComponentFixture<ModalSponsorshipRangoPersonalizadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSponsorshipRangoPersonalizadoComponent]
    });
    fixture = TestBed.createComponent(ModalSponsorshipRangoPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
