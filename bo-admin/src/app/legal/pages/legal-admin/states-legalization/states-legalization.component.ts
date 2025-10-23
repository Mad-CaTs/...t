import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { LegalService } from '@app/legal/services/LegalService';
import { IStatusLegalRequest, IStatusLegalRequestOne } from '@interfaces/legal-module.interface';
import { NgbModal, NgbModalRef, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
	selector: 'app-states-legalization',
	standalone: true,
	templateUrl: './states-legalization.component.html',
	styleUrls: ['./states-legalization.component.scss'],
	imports: [CommonModule, TablesModule, InlineSVGModule, FormsModule, NgbNavModule]
})
export class StatesLegalizationComponent {
	@ViewChild('confirmationModal') confirmationModal: any; // referencia al modal de confirmación
	@ViewChild('confirmEdit') confirmEdit: TemplateRef<any>; // referencia al modal de confirmación edicion
	@ViewChild('deleteConfirmationModal') deleteConfirmationModal!: TemplateRef<any>;
	// campo para guardar el item que queremos eliminar
	selectedToDelete: IStatusLegalRequestOne | null = null;

	//tabla
	readonly table: TableModel<IStatusLegalRequestOne>;

	fullData: IStatusLegalRequestOne[] = []; // datos reales
	filteredData: IStatusLegalRequestOne[] = [];

	//Filtros
	searchTerm: string = '';

	isLoading = true;

	selectedStatus: IStatusLegalRequestOne | null = null;
	editedDescription: string = '';
	//editedEstado: string = '';
	editedEstado: number = 1;
	editModalRef: any;
	editedName: string = ''; //
	editedColor: string = '#000000';

	statusList = [
		{ color: '#17a2b8', value: '' }, // azul
		{ color: '#ffc107', value: '' }, // amarillo
		{ color: '#dc3545', value: '' }, // rojo
		{ color: '#28a745', value: '' }, // verde
		{ color: '#6c757d', value: '' } // gris
	];

	newStatus = {
		color: '',
		name: ''
	};

	constructor(
		private legalService: LegalService,
		private tableService: TableService,
		private modalService: NgbModal, //agregado
		private cdr: ChangeDetectorRef
	) {
		this.table = this.tableService.generateTable<IStatusLegalRequestOne>({
			headers: ['N°', 'Nombre', 'Etiqueta', 'Descripción', 'Estado', 'Acciones']
		});
	}

	ngOnInit(): void {
		//this.loadMockData();
		this.loadRealData();
	}

	loadRealData(): void {
		this.isLoading = true;
		this.legalService.getStatusAll().subscribe({
			next: (response: any) => {
				const data = response.data as IStatusLegalRequestOne[];

				this.fullData = data;
				this.filteredData = [...data];
				console.log(`Estados de legalizacion`, this.fullData);
				this.table.data = [...data];
				this.isLoading = false;

				this.cdr.detectChanges();
			},
			error: (error) => {
				console.error('Error al obtener los estados:', error);
				this.isLoading = false;
			}
		});
	}

	onFiltersChange() {
		this.filteredData = this.fullData.filter((states) => {
			const search = this.searchTerm.toLowerCase();
			return this.searchTerm
				? states.color.toLowerCase().includes(search) ||
						states.name.toLowerCase().includes(search) ||
						states.description.toLowerCase().includes(search) ||
						states.color.toLowerCase().includes(search) ||
						states.detail.toLowerCase().includes(search) ||
						states.id.toString().includes(search)
				: true;
		});
		this.table.data = [...this.filteredData];
		this.cdr.detectChanges();
	}

	clearFilters() {
		this.searchTerm = '';
		this.filteredData = [...this.fullData];
		this.table.data = [...this.fullData];
		this.cdr.detectChanges();
	}

	/** resetear filtros y recargar datos mock */
	refreshData(): void {
		this.searchTerm = '';
		this.loadRealData();
		console.log('Datos recargados y filtros limpiados');
		console.log('Lista actual de datos en la tabla:', this.table.data);
	}

	openAddStatusModalX(content: any) {
		this.modalService.open(content, {
			size: 'lg',
			centered: true,
			backdrop: 'static'
		});
	}

	openAddStatusModal(content: any) {
		this.statusList = [{ color: '#000000', value: '' }]; // iniciar con una fila vacía
		this.modalService.open(content, {
			//size: 'lg',
			centered: true
			//backdrop: 'static'
		});
	}

	// Metodo para agregar un nuevo status
	addStatusX(modal: any) {
		console.log('Estados ingresados:', this.statusList);
		//agregar la logica para enviar los datos al backend o realizar otra accion
		modal.close(); //cierra el modal de agregar estado
		//abre el modal de confirmación
		this.modalService.open(this.confirmationModal, {
			centered: true,
			backdrop: 'static'
		});

		//recargar la tabla: se hace depende del flujo
		//this.loadMockData(); //con datos mockeados
		this.loadRealData();

		//si se tiene un servicio real, aca recargar los datos de la tabla:
		// this.loadRealData(); //llamar a un API para obtener los datos actualizados
	}

	addStatus(modal: any): void {
		const { color, name } = this.newStatus;

		if (!name.trim() || !color.trim()) {
			alert('El nombre y el color no pueden estar vacíos.');
			return;
		}

		this.legalService.addStatusCustom({ color, name, description: name }).subscribe({
			next: (response) => {
				console.log('Nuevo estado agregado:', response);

				modal.close();

				this.modalService.open(this.confirmationModal, {
					centered: true,
					backdrop: 'static'
				});

				this.newStatus = { color: '', name: '' }; // limpia campos
				this.loadRealData(); // recarga la tabla
			},
			error: (error) => {
				console.error('Error al agregar el estado:', error);
				alert('Ocurrió un error al agregar el estado. Intenta nuevamente.');
			}
		});
	}

	addEmptyStatus(event: Event) {
		event.preventDefault();
		if (this.statusList.length < 5) {
			this.statusList.push({ color: '#000000', value: '' });
		}
	}

	//metodo para eliminar una fila de la lista
	removeStatus(index: number): void {
		if (this.statusList.length > 1) {
			this.statusList.splice(index, 1); // eliminar el elemento en el indice especificado
		}
	}

	//funcion para verificar si todos los campos estan completos
	isFormValid(): boolean {
		//return this.statusList.every((item) => item.color && item.value); // verifica que cada fila tenga color y valor
		return this.newStatus.color.trim() !== '' && this.newStatus.name.trim() !== '';
	}

	openEditStatusModal(content: any, item: IStatusLegalRequestOne): void {
		this.selectedStatus = item;
		this.editedName = item.name;
		this.editedDescription = item.detail;
		this.editedEstado = item.active;
		//this.editedEstado = Number(status.active) === 1 ? 'Activado' : 'Desactivado';
		this.editedColor = item.color;

		this.modalService.open(content, {
			centered: true,
			backdrop: 'static'
		});
	}

	saveEditedStatus(currentModal: NgbModalRef): void {
		if (!this.editedName.trim()) {
			alert('El nombre no puede estar vacío.');
			return;
		}

		// abre el modal de confirmación usando el ViewChild
		const modalRef = this.modalService.open(this.confirmEdit, {
			centered: true,
			backdrop: 'static' // Esto asegura que no se cierre si el usuario hace clic fuera del modal
		});
		// cuando el usuario confirme, se actualizan los datos
		modalRef.result
			.then(() => {
				if (this.selectedStatus) {
					const payload = {
						color: this.editedColor,
						name: this.editedName,
						detail: this.editedDescription,
						active: Number(this.editedEstado)
					};
					const id = this.selectedStatus.id;

					this.legalService.editStatusById(id, payload).subscribe({
						next: (response) => {
							this.selectedStatus!.description = this.editedDescription;
							this.selectedStatus!.name = this.editedName;
							this.selectedStatus!.color = this.editedColor;
							this.selectedStatus!.active = Number(this.editedEstado);

							console.log('Status editado con éxito:', response);
							this.refreshData();

							currentModal.close();
							//this.refreshData();
						},
						error: (error) => {
							console.error('Error al editar el status:', error);
							alert('Error al guardar los cambios. Intenta de nuevo.');
						}
					});
				}
			})
			.catch(() => {
				console.log('Edición cancelada');
			});
	}

	confirmEditM(modal: any): void {
		if (!this.editedName.trim()) {
			alert('El nombre no pueden estar vacío.');
			return;
		}
		// Aquí podrías evitar la duplicación llamando a saveEditedStatus o haciendo la lógica igual
		if (this.selectedStatus) {
			const payload = {
				color: this.editedColor,
				name: this.editedName,
				detail: this.editedDescription,
				active: Number(this.editedEstado)
			};
			const id = this.selectedStatus.id;

			this.legalService.editStatusById(id, payload).subscribe({
				next: (response) => {
					this.selectedStatus!.description = this.editedDescription;
					this.selectedStatus!.name = this.editedName;
					this.selectedStatus!.color = this.editedColor;
					this.selectedStatus!.active = Number(this.editedEstado);

					console.log('Status editado con éxito:', response);

					modal.close();
					this.refreshData();
				},
				error: (error) => {
					console.error('Error al editar el status:', error);
					alert('Error al guardar los cambios. Intenta de nuevo.');
				}
			});
		}
	}

	confirmEditModalOld(modal: any): void {
		if (this.selectedStatus) {
			this.selectedStatus.description = this.editedDescription;
			this.selectedStatus.active = Number(this.editedEstado);

			console.log('Status editado:', this.selectedStatus);
		}

		modal.close(); // cierra el modal de confirmacin
		this.refreshData(); // recarga la tabla
	}

	/** abre el modal y marca el item para borrar */
	openDeleteModal(item: IStatusLegalRequestOne) {
		this.selectedToDelete = item;
		this.modalService.open(this.deleteConfirmationModal, {
			centered: true,
			backdrop: 'static'
		});
	}

	/** se ejecuta cuando el usuario confirma la eliminacion */
	confirmDelete(modalRef: NgbModalRef) {
		if (!this.selectedToDelete) {
			modalRef.dismiss();
			return;
		}

		this.legalService.deleteStatus(this.selectedToDelete.id).subscribe({
			next: (res) => {
				console.log('Estado eliminado:', res);
				// refresca la lista (puedes quitarlos localmente o recargar del backend)
				this.refreshData();
				modalRef.close();
				this.selectedToDelete = null;
			},
			error: (err) => {
				console.error('Error eliminando el estado:', err);
				alert('Ocurrió un error al eliminar. Intenta de nuevo.');
				modalRef.dismiss();
				this.selectedToDelete = null;
			}
		});
	}

	getHarmoniousTextColor(bgColor: string): string {
		console.log('bgColor recibido:', bgColor);
		// Quitar el '#' si existe
		const hex = bgColor.replace('#', '');

		// Convertir a RGB
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		// Calcular luminancia relativa
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

		const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
		console.log(`r: ${r}, g: ${g}, b: ${b}, luminance: ${luminance.toFixed(2)}, texto: ${textColor}`);
		return textColor;
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
		console.log({
			originalHex: hex,
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255),
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			originalL: Math.round(l * 100),
			adjustedL: Math.round(adjustedL * 100),
			hslColor
		});

		return hslColor;
	}

	getBadgeStyles(color: string) {
		return {
			'background-color': color,
			color: this.getHarmoniousTextColorFix(color)
		};
	}
}
