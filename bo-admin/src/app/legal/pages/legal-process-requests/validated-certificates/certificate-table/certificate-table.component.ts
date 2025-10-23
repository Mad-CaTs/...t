import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { LegalService } from '@app/legal/services/LegalService';
import {
	IAuthorizedPerson,
	IValidatedCertificatesRequestOne,
	OptionDTO
} from '@interfaces/legal-module.interface';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UserAddressPipe } from '../../../legalization-requests/commons/pipes/user-address.pipe';
import { ModalDetailComponent } from '@app/legal/pages/legalization-requests/commons/modals/modal-detail/modal-detail.component';

@Component({
	selector: 'app-certificate-table',
	standalone: true,
	templateUrl: './certificate-table.component.html',
	styleUrls: ['./certificate-table.component.scss'],
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule, UserAddressPipe]
})
export class CertificateTableComponent {
	@Input() data: IValidatedCertificatesRequestOne[] = [];
	@Output() actualizarTabla = new EventEmitter<void>();
	table: TableModel<IValidatedCertificatesRequestOne>;
	selectedItem: any; // tipo correspondiente
	statusList: Array<{ id: number; statusCode: number; name: string }> = [];
	@ViewChild('modalNotificar') modalNotificar!: TemplateRef<any>;
	@ViewChild('modalConfirmacion') modalConfirmacion!: TemplateRef<any>;
	textoSeleccionado: string = '';
	disponibilidaLegalizardMapTo: { [key: number]: string } = {};
	disponibilidadMapTo: { [key: number]: string } = {};
	disponibilidadLegalizarOpciones: OptionDTO[] = [];
	disponibilidadOpciones: OptionDTO[] = [];
	selectedAuthorizedPerson?: IAuthorizedPerson;

	form = {
		status: '',
		observacion: ''
	};

	selectedSerpost: any;

	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private modalService: NgbModal,
		private legalService: LegalService
	) {
		this.table = this.tableService.generateTable<IValidatedCertificatesRequestOne>({
			headers: [
				'Fec. de Solicitud',
				'Lugar de recojo',
				'Solicitante',
				'Firma en notaria',
				'N° de documento',
				'Legalización',
				'Pais',
				'Dirección',
				'Serpost',
				'Persona Autorizada',
				'Status',
				'Notificar',
				'Documento'
			]
		});
	}

	ngOnInit() {
		this.loadStatusList();
		this.loadLegalizationMethodOpciones();
		this.loadDisponibilidadOpciones();
	}

	loadStatusList() {
		this.legalService.getStatusCodeAll().subscribe({
			next: (response: any) => {
				// asumo que la respuesta tiene la estructura { status, message, data }
				this.statusList = response.data.map((status: any) => ({
					id: status.id,
					statusCode: status.statusCode,
					name: status.name
				}));
				this.cdr.detectChanges();
				console.log('Lista de estados', this.statusList);
			},
			error: (err) => {
				console.error('Error cargando lista de estados:', err);
			}
		});
	}

	//para abrir la imagen opc2
	abrirImagen(url?: string): void {
		if (!url) return;
		window.open(url, '_blank');
	}

	abrirModalNotificar(item: any) {
		this.selectedItem = item;
		this.modalService.open(this.modalNotificar, { size: 'lg' });
	}

	notificar() {
		const payload = {
			userPanelId: 0, // Cambia esto si tienes el userPanelId real
			documentKey: this.selectedItem.documentKey,
			status: Number(this.form.status), // enviar id del status
			reasonType: 0, // o modifica si tienes lógica para esto
			reasonText: this.form.observacion
		};

		this.legalService.changeDocumentStatus(payload).subscribe({
			next: (response) => {
				console.log('Cambio de estado exitoso:', response);
				this.modalService.dismissAll();
				this.modalService.open(this.modalConfirmacion, { centered: true });
				this.actualizarTabla.emit(); // <--- EMITE al padre para recargar tabla
			},
			error: (err) => {
				console.error('Error al cambiar estado:', err);
				alert('Error al enviar notificación. Inténtalo nuevamente.');
			}
		});
	}

	getHarmoniousTextColorFix(hex: string): string {
		if (!hex) return '#000';

		hex = hex.replace('#', '');

		let r = parseInt(hex.substring(0, 2), 16) / 255;
		let g = parseInt(hex.substring(2, 4), 16) / 255;
		let b = parseInt(hex.substring(4, 6), 16) / 255;

		// Convertir RGB a HSL
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0,
			s = 0,
			l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		// Ajustar la luminosidad para generar contraste
		const adjustedL = l > 0.5 ? l - 0.4 : l + 0.4;

		const hslColor = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
			adjustedL * 100
		)}%)`;

		// LOG para verificar valores
		/* console.log({
			originalHex: hex,
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255),
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			originalL: Math.round(l * 100),
			adjustedL: Math.round(adjustedL * 100),
			hslColor
		}); */

		return hslColor;
	}

	getBadgeStyles(color: string) {
		return {
			'background-color': color,
			color: this.getHarmoniousTextColorFix(color)
		};
	}

	openSerpost(content: any, item: any) {
		this.selectedSerpost = item;
		this.modalService.open(content, { size: 'lg' });
	}

	openDetailModal(item: any) {
		const ref = this.modalService.open(ModalDetailComponent, {
			size: 'lg',
			centered: true
		});

		const modal = ref.componentInstance as ModalDetailComponent;
		modal.title = 'Detalle de dirección consignada';
		modal.data = item;
	}

	openDisponibilidad(content: TemplateRef<any>, id: number | null, userLocalUbic: number) {
		if (userLocalUbic === 1) {
			// Para Lima -> legalizationMethodId
			this.textoSeleccionado = this.disponibilidaLegalizardMapTo[id!] ?? '—';
		} else {
			// Para provincia -> disponibilidadTramiteId
			this.textoSeleccionado = this.disponibilidadMapTo[id!] ?? '—';
		}

		this.modalService.open(content, { size: 'lg' });
	}

	private loadLegalizationMethodOpciones(): void {
		this.legalService.getOptions('DISPONIBILIDAD_LEGALIZAR').subscribe({
			next: (data) => {
				this.disponibilidadLegalizarOpciones = data;
				this.disponibilidaLegalizardMapTo = data.reduce((acc, opt) => {
					acc[opt.code] = opt.description;
					return acc;
				}, {} as { [key: number]: string });
			},
			error: (err) => console.error('Error cargando opciones:', err)
		});
	}

	private loadDisponibilidadOpciones(): void {
		this.legalService.getOptions('DISPONIBILIDAD_TRAMITE').subscribe({
			next: (data) => {
				this.disponibilidadOpciones = data;
				this.disponibilidadMapTo = data.reduce((acc, opt) => {
					acc[opt.code] = opt.description;
					return acc;
				}, {} as { [key: number]: string });
			},
			error: (err) => console.error('Error cargando opciones:', err)
		});
	}

	openAuthorizedPerson(content: any, authorizedPerson: IAuthorizedPerson) {
		this.selectedAuthorizedPerson = authorizedPerson;
		this.modalService.open(content, { size: 'lg' });
	}
}
