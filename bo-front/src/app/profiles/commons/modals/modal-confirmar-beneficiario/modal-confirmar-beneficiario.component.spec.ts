import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmarBeneficiarioComponent } from './modal-confirmar-beneficiario.component';

describe('ModalConfirmarBeneficiarioComponent', () => {
  let component: ModalConfirmarBeneficiarioComponent;
  let fixture: ComponentFixture<ModalConfirmarBeneficiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmarBeneficiarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalConfirmarBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
