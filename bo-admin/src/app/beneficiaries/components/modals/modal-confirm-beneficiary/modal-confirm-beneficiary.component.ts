import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-confirm-beneficiary',
  templateUrl: './modal-confirm-beneficiary.component.html',
  styleUrls: ['./modal-confirm-beneficiary.component.scss']
})
export class ModalConfirmBeneficiaryComponent {

  title = 'Registro exitoso';
  text  = 'El nuevo beneficiario fue guardado correctamente en el administrador.';
  icon  = 'pi-check-circle';

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig){
    if (config?.data) {
      this.title = config.data.title ?? this.title;
      this.text  = config.data.text  ?? this.text;
      this.icon  = config.data.icon  ?? this.icon;
    }
  }

  confirm(): void {
    this.ref.close(true);
  }


}
