import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
	getStatusColor,
	hexToRgba
} from '../../../pages/my-legalization/legalization-panel/pages/document-status/commons/constans';
import { LegalizationService } from '../../../pages/my-legalization/commons/services/legalization.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { ISelect } from '@shared/interfaces/forms-control';
import { LoaderComponent } from '@shared/components/loader/loader.component';

@Component({
	selector: 'app-membership-card',
	standalone: true,
	imports: [CommonModule,LoaderComponent],
	templateUrl: './membership-card.component.html',
	styleUrl: './membership-card.component.scss'
})
export class MembershipCardComponent {
	@Input() membership: any;
	@Output() accionSeleccionada = new EventEmitter<{ tipo: number; data: any }>();
	@Input() color: string = '';
  @Input() documentTypes: ISelect[] = [];
/*   @Input() documentTypesLoaded!: boolean;
 */  @Input() documentTypesLoaded: boolean = false;


	public legalizationDocList: ISelect[];

	private destroy$: Subject<void> = new Subject<void>();

	readonly estadosConAcciones: number[] = [1, 12, 5, 6, 7];

	constructor(private legalizationService: LegalizationService) {}

	ngOnInit() {
    console.log("documentTypesLoaded",this.documentTypesLoaded)
	    console.log("membership",this.membership)
    console.log("color",this.color)

 	}

   onClick(tipo: ISelect): void {
		this.accionSeleccionada.emit({ tipo: tipo.value, data: this.membership });
	}

/* 	onClick(tipo: 'contrato' | 'certificado') {
		this.accionSeleccionada.emit({ tipo, data: this.membership });
	} */

	get statusColors() {
		return getStatusColor(this.membership?.status, this.color);
	}

	get puedeVerAcciones(): boolean {
		return this.estadosConAcciones.includes(this.membership?.idStatus);
	}

/*   private loadDocumentTypes(): void {
		this.legalizationService.getDocumentTypes().subscribe({
			next: (types) => (this.legalizationDocList = types),
			error: () => console.error('Error al cargar tipos de documentos')
		});
	} */

   
    
}
