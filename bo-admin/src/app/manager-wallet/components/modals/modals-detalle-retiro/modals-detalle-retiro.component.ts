import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalRechazarSolicitudComponent } from '../modal-rechazar-solicitud/modal-rechazar-solicitud.component';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { RetirosService } from '@app/manager-wallet/services/retiros.service';
import { AuthService } from '@app/auth';

@Component({
  selector: 'app-modals-detalle-retiro',
  templateUrl: './modals-detalle-retiro.component.html',
  styleUrls: ['./modals-detalle-retiro.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormControlModule],
  standalone: true,
})
export class ModalsDetalleRetiroComponent {
  @Input() icon: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() data: any;
  @Input() typeOfTab?: string = "rvalidar";
  @Input() getColorBackground: string;
  @Input() getColorFont: string;

  tempMotivoId: number = 5
  tempMotivo: string = 'Otros motivos';
  tempMensaje: string = 'El retiro no pudo completarse porque el número de cuenta de destino ingresado está incompleto.';
  motivosList: ISelectOpt[] = [];

  status: number;
  holder: string;

  private readonly tabStatusIds: { [key: number]: string } = {
    1: 'Recibido',
    2: 'Pre aprobado',
    3: 'Pre rechazado',
    4: 'Aprobado',
    5: 'Rechazado'
  };

  constructor(
    private authService : AuthService,
    public instanceModal: NgbActiveModal,
    private modalManager: NgbModal,
    public activeModal: NgbActiveModal,
    private retiroService : RetirosService
  ) {}

   ngOnInit(): void {
    this.status = this.data['idBankStatus'];
    this.holder = this.data['nameHolder'] + " " + this.data['lastNameHolder'];
    
    this.loadMotivos();
  }

  loadMotivos(): void {
    this.retiroService.gestListReazon().subscribe({
      next: (reasons: any) => {
        this.motivosList = reasons['data'].map((data: any) => ({
          id: data.idReasonRetiroBank,
          text: data.title
        }));
        console.log('Motivos cargados en modal padre:', this.motivosList);
      },
      error: (err) => {
        console.error('Error al obtener razones:', err);
      }
    });
  }

  get text(): string {
    return this.tabStatusIds[this.status] || '';
  }

  formatDateArrayToString(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 7) {
      return 'Fecha inválida';
    }

    const [year, month, day, hours, minutes, seconds, microseconds] = dateArray;
    const date = new Date(year, month - 1, day, hours, minutes, seconds, microseconds / 1000);

    const formattedDay = date.getDate().toString().padStart(2, '0');
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedYear = date.getFullYear();

    let formattedHours = date.getHours();
    const ampm = formattedHours >= 12 ? 'p.m.' : 'a.m.';
    formattedHours = formattedHours % 12;
    formattedHours = formattedHours === 0 ? 12 : formattedHours;
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0');

    return `${formattedDay}/${formattedMonth}/${formattedYear} | ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  closeModalDetails(): void {
    this.activeModal.close();
  }

  openModalNotification(row: any): void {
  this.activeModal.dismiss();

  const ref = this.modalManager.open(ModalRechazarSolicitudComponent, {
    centered: true,
    size: 'md',
    backdrop: 'static',
    keyboard: false
  });

  const modal = ref.componentInstance as ModalRechazarSolicitudComponent;
  
  modal.data = row;
  modal.currentMotivo = this.tempMotivo;
  modal.currentMensaje = this.tempMensaje;

  ref.result.then(
    (result) => {
      if (result && result.success && result.data) {
        console.log(result.data.motivo, 'id')
        this.tempMotivoId = result.data.motivo;
        this.tempMotivo = this.getSelectedMotivoText(result.data.motivo);
        this.tempMensaje = result.data.msg;
      }
      this.reopenThisModal();
    },
    () => {
      this.reopenThisModal();
    }
  );
}

  private getSelectedMotivoText(motivoId: number): string {
    const motivo = this.motivosList.find(m => +m.id === motivoId);
    const textoMotivo = motivo ? motivo.text : 'Otros motivos';
        
    return textoMotivo;
  }

  private reopenThisModal(): void {
    const ref = this.modalManager.open(ModalsDetalleRetiroComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });

    const modal = ref.componentInstance as ModalsDetalleRetiroComponent;
    
    modal.data = this.data;
    modal.typeOfTab = this.typeOfTab;
    modal.icon = this.icon;
    modal.title = this.title;
    modal.subtitle = this.subtitle;
    modal.getColorBackground = this.getColorBackground;
    modal.getColorFont = this.getColorFont;
    modal.tempMotivoId = this.tempMotivoId
    modal.tempMotivo = this.tempMotivo;
    modal.tempMensaje = this.tempMensaje;
  }

  rechazarYNotificar(): void {
    const requestBody = {
      idsolicitudebank: this.data['idsolicitudebank'],
      namePropio : this.data['nameHolder'] + " " + this.data['lastNameHolder'],
      lastnamePropio : this.data['lastNameHolder'],
      idReasonRetiroBank: this.tempMotivoId,
      msg: this.tempMensaje,
      status: 0
    };
    
    this.retiroService.rejectedWithdrawal(requestBody, this.authService.getUsernameOfCurrentUser()).subscribe({
      next: (response) => {
        console.log(response, 'response')
        this.activeModal.close({ success: true, data: response });
      },
      error: (error) => {
        console.log(error, 'error')
      }
    });
    
    this.activeModal.close({ success: true, data: requestBody });
  }
}