import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@app/core/services/toast.service';
import { RetirosService } from '@app/manager-wallet/services/retiros.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';

@Component({
  selector: 'app-modal-rechazar-solicitud',
  templateUrl: './modal-rechazar-solicitud.component.html',
  styleUrls: ['./modal-rechazar-solicitud.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormControlModule,
  ]

})
export class ModalRechazarSolicitudComponent {
  @Input() openParentModal: () => void;
  @Input() closeParentModal: () => void;
  @Input() data: any;

  @Input() currentMotivo: string = '';
  @Input() currentMensaje: string = '';

  public form: FormGroup;
  descriptionLabel = 'Mensaje adicional o solución alternativa*';
  otherReasonsLabel = 'Indicar el Motivo';
  texto: string = '';
  motivoSelect: ISelectOpt[] = []
  constructor(
    public instanceModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    private retiroService: RetirosService,
    private toastService: ToastService
  ) { }
  ngOnInit() {
    this.initForm();
    this.initService();
    this.form.get('msg')?.valueChanges.subscribe(value => {
      this.texto = value || '';
    });
  }
  initForm() {
    this.form = this.formBuilder.group({
      motivo: [null, [Validators.required]],
      otherReason: [''],
      msg: ['', [Validators.required]],
    })
  }
  initService(): void {
    this.retiroService.gestListReazon().subscribe({
      next: (reasons: any) => {
        this.motivoSelect = reasons['data'].map((data: any) => ({
          id: data.idReasonRetiroBank,
          text: data.title
        }));
        
        this.setCurrentValues();
      },
      error: (err) => {
        console.error('Error al obtener razones:', err);
        this.toastService.addToast('Error al cargar los motivos', 'error');
      }
    });
  }

  private setCurrentValues(): void {
    // Busca el ID del motivo actual por su texto
    const motivoActual = this.motivoSelect.find(m => m.text === this.currentMotivo);
    
    if (motivoActual) {
      this.form.patchValue({
        motivo: motivoActual.id,
        msg: this.currentMensaje
      });
    } else {
      // Si no encuentra el motivo, establece solo el mensaje
      this.form.patchValue({
        msg: this.currentMensaje
      });
    }
  }

  contarCaracteres() {
    const msgControl = this.form.get('msg');
    if (msgControl && msgControl.value.length > 250) {
      msgControl.setValue(msgControl.value.substring(0, 250));
    }
  }
  cancelar() {
    this.instanceModal.close({ success: false })

  }
  validInput() {
    const paso1Controls = ['motivo', 'msg'
    ];
    paso1Controls.forEach(controlName => {
      this.form.get(controlName)?.markAsTouched();
    });
    return this.form.valid ||

      (this.form.get('motivo')?.valid && this.form.get('msg')?.valid);
  }
  rechazar(): void {
    if (!this.validInput()) {
      return this.toastService.addToast('Completa todos los campos', 'warning');
    }

    const obj = {
      motivo: this.form.get('motivo')?.value,
      otherReason: this.form.get('otherReason')?.value,
      msg: this.form.get('msg')?.value,
    };

    // Cierra el modal y devuelve los datos guardados
    this.instanceModal.close({ success: true, data: obj });
  }

  cancelUpdateNotification(): void {
    // Cierra este modal sin guardar cambios
    this.instanceModal.dismiss();
    
    // Reabre el modal padre
    if (this.openParentModal) {
      this.openParentModal();
    }
  }

  onReject() {
    // Aquí cierras este modal
    this.instanceModal.close({ success: true });

    // Y luego cierras el modal padre (si se pasó)
    if (this.closeParentModal) {
      this.closeParentModal();
    }
  }
}
