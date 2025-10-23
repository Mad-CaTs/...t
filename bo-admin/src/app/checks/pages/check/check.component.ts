import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import {
	ApplicationRef,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ElementRef,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import html2canvas from 'html2canvas';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { AwardCardComponent } from '@app/checks/components';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ITableCheck } from '@interfaces/check.interface';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-check',
	templateUrl: './check.component.html',
	styleUrls: ['./check.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule
	]
})
export class CheckComponent {
	public readonly table: TableModel<ITableCheck>;
	public processedCheques: number = 0;
	public totalChequesToProcess: number = 0;
	data: any[] = [];
	form: FormGroup;
	buttonLoading: boolean = false;
	buttonDowloadLoading: boolean = false;

	// Select club
	clubOpt: ISelectOpt[] = [
		{ id: '1', text: 'Club 1M' },
		{ id: '2', text: 'Club 500k' },
		{ id: '3', text: 'Club 250k' },
		{ id: '4', text: 'Club 100k' },
		{ id: '5', text: 'Club 50k' },
		{ id: '6', text: 'Club 25k' },
		{ id: '7', text: 'Club 10k' }
	];

	@ViewChild('cardElement', { static: false }) cardElement!: ElementRef;

	constructor(
		private formBuilder: FormBuilder,
		private tableService: TableService,
		private cdr: ChangeDetectorRef,
		private componentFactoryResolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef,
		private appRef: ApplicationRef
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableCheck>({
			headers: [
				'N°',
				//  'Usuario',
				'Nombres',
				'Apellidos',
				'Total',
				'Club'
			],
			headersMinWidth: [45],
			headersMaxWidth: [45],
			noCheckBoxes: true
		});

		this.table.data = [];

		this.form = formBuilder.group({
			club: ['1', [Validators.required]]
		});
	}

	// Subir Archivo Excel
	onFileChange(file: File) {
		if (!file) {
			console.error('No se ha recibido ningún archivo');
			return;
		}

		const reader: FileReader = new FileReader();

		reader.onload = (e: any) => {
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

			// Buscar la hoja llamada "Sheet1"
			const sheetName = wb.SheetNames.find((name) => name === 'CHEQUES');

			if (!sheetName) {
				console.error('No se encontró la hoja "Sheet1" en el archivo');
				return;
			}

			const ws: XLSX.WorkSheet = wb.Sheets[sheetName];

			const excelData = XLSX.utils.sheet_to_json(ws);

			this.data = excelData.map((row: any) => ({
				// username: row.user_name || row['user name'] || row.username || '',
				name: row['NOMBRE'] || row.nombre || '',
				lastname: row['APELLIDOS'] || row.apellidos || '',
				total: row['MONTO'] || row.monto || 0,
				club: row['CLUB'] || row.Club || row.club || '',
				id: row.idsponsor || row.id || ''
			}));
		};

		reader.readAsBinaryString(file);
	}

	// Descarga de Cheques
	async downloadAllChecks() {
		this.buttonDowloadLoading = true;
		this.processedCheques = 0;
		this.totalChequesToProcess = this.table.data.length;
		this.cdr.detectChanges();

		const zip = new JSZip();
		const imgFolder = zip.folder('cheques');

		if (!imgFolder) {
			console.error('No se pudo crear la carpeta en el archivo ZIP');
			this.buttonDowloadLoading = false;
			this.cdr.detectChanges();
			return;
		}

		try {
			// Procesar cada cheque secuencialmente
			for (const item of this.table.data) {
				const blob = await this.generateCheckImage(item.cheque);
				if (blob) {
					const fileName = this.generateFileName(item.cheque);
					imgFolder.file(fileName, blob);
				}
				this.processedCheques++;
				this.cdr.detectChanges();
			}

			if (this.processedCheques > 0) {
				const content = await zip.generateAsync({ type: 'blob' });
				saveAs(content, 'cheques_premios.zip');
			}
		} catch (error) {
			console.error('Error al generar cheques:', error);
		} finally {
			this.buttonDowloadLoading = false;
			this.cdr.detectChanges();
		}
	}

	// Generar nombre del archivo
	private generateFileName(checkData: any): string {
		return `cheque_${checkData.name}_${checkData.lastname}.png`
			.replace(/\s+/g, '_')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}

	// Generar imagen temporal
	private async generateCheckImage(checkData: any): Promise<Blob | null> {
		return new Promise(async (resolve) => {
			try {
				// 1. Crear contenedor temporal
				const container = document.createElement('div');
				container.style.position = 'fixed';
				container.style.left = '-10000px';
				container.style.top = '0';
				document.body.appendChild(container);

				// 2. Crear componente Angular correctamente
				const componentFactory =
					this.componentFactoryResolver.resolveComponentFactory(AwardCardComponent);
				const componentRef = componentFactory.create(this.viewContainerRef.injector);

				// 3. Asignar propiedades
				componentRef.instance.name = checkData.name;
				componentRef.instance.lastname = checkData.lastname;
				componentRef.instance.amount = checkData.amount;
				componentRef.instance.clubName = checkData.clubName;

				// 4. Adjuntar al DOM
				this.appRef.attachView(componentRef.hostView);
				container.appendChild(componentRef.location.nativeElement);

				// 5. Forzar detección de cambios
				componentRef.changeDetectorRef.detectChanges();
				this.appRef.tick();

				// 6. Esperar renderizado (con timeout escalonado)
				await new Promise((resolve) => setTimeout(resolve, 300));

				// 7. Capturar imagen
				const canvas = await html2canvas(componentRef.location.nativeElement, {
					scale: 2,
					useCORS: true,
					allowTaint: true,
					logging: true,
					backgroundColor: null
				});

				// 8. Convertir a blob
				canvas.toBlob(
					(blob) => {
						// 9. Limpiar
						this.appRef.detachView(componentRef.hostView);
						componentRef.destroy();
						document.body.removeChild(container);

						resolve(blob);
					},
					'image/png',
					1.0
				);
			} catch (error) {
				console.error('Error generando cheque:', error);
				resolve(null);
			}
		});
	}

	// Aplica el filtro
	onSearch() {
		this.buttonLoading = true;

		const selectedClubId = this.form.get('club')?.value;
		const selectedClub = this.clubOpt.find((club) => club.id === selectedClubId)?.text || '';

		const filteredData = this.data.filter((item) => item.club?.trim() === selectedClub.trim());

		this.table.data = filteredData.map((item, index) => {
			const numericValue = item.total.replace(/[^\d,.-]/g, '');
			const cleanNumber = numericValue.replace(/,/g, '');
			const totalNumber = parseFloat(cleanNumber);

			return {
				'N°': index + 1,
				name: item.name,
				lastname: item.lastname,
				total: this.roundToTwoDecimals(totalNumber),
				club: item.club,
				id: item.id,
				cheque: {
					name: item.name,
					lastname: item.lastname,
					amount: Math.floor(totalNumber),
					clubName: item.club
				}
			};
		});

		this.buttonLoading = false;
	}

	private roundToTwoDecimals(value: number): number {
		return Math.round((value + Number.EPSILON) * 100) / 100;
	}
}
