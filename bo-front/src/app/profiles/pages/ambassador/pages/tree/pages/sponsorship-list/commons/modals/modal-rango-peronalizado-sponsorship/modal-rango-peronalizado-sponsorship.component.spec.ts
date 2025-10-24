import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRangoPeronalizadoSponsorshipComponent } from './modal-rango-peronalizado-sponsorship.component';

describe('ModalRangoPeronalizadoSponsorshipComponent', () => {
  let component: ModalRangoPeronalizadoSponsorshipComponent;
  let fixture: ComponentFixture<ModalRangoPeronalizadoSponsorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRangoPeronalizadoSponsorshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalRangoPeronalizadoSponsorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
