import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFiltroRangoPersonalizadoComponent } from './modal-filtro-rango-personalizado.component';

describe('ModalFiltroRangoPersonalizadoComponent', () => {
  let component: ModalFiltroRangoPersonalizadoComponent;
  let fixture: ComponentFixture<ModalFiltroRangoPersonalizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFiltroRangoPersonalizadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalFiltroRangoPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
