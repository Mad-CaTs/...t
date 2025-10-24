import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import { BorderedTableComponent } from '@shared/components/bordered-table/bordered-table.component';
import { DocumentService } from '../../../../my-products/pages/documents/commons/services/documents-service';

@Component({
	selector: 'app-modal-legalization-request',
	standalone: true,
	providers: [MessageService],
	imports: [
		CommonModule,
		MatIconModule,
		DialogModule,
		ToastModule,
		MatIconModule,
		TableModule,
		BorderedTableComponent
	],
	templateUrl: './modal-legalization-request.html',
	styleUrl: './modal-legalization-request.scss'
})
export class ModalLegalizationRequest implements OnInit {
	dialogRef: DynamicDialogRef;
	idUser: number;
	documentPackage: any;
	rows: any[][] = [];

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		public tableService: TableService,
		private documentService: DocumentService
	) {}

	ngOnInit(): void {
		this.loadDocumentPackage();
		this.buildTableRows();
	}

	private loadDocumentPackage(): void {
		this.documentPackage = this.config.data.documentPackage;
	}
	private buildTableRows(): void {
		const documentos = this.documentPackage?.listLegalDocuments || [];
		this.rows = documentos.map((doc: any, index: number) => {
			const fecha = this.formatDate(doc.creationDate);
			if (doc.generatedLink && doc.generatedLink !== '#') {
				return [index + 1, doc.name, fecha, doc.generatedLink, 'ok'];
			}
			return [index + 1, doc.name, fecha, null, 'error'];
		});
	}

	formatDate(dateArray: number[]): string {
		const [year, month, day] = dateArray;
		return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
	}

	verDocumento(doc: any): void {
		const index = this.documentPackage.listLegalDocuments.findIndex(
			(d: any) => d.idLegalDocument === doc.idLegalDocument
		);
		if (index === -1) return;
		const link = this.rows[index]?.[3];
		if (link) {
			window.open(link, '_blank');
		}
	}

	closeModal() {
		this.ref.close();
	}

	get headers() {
		return ['N° ', 'Documento', 'Fecha', 'Acciones'];
	}

	private hexToRgba(hex: string, opacity: number, factor: number): string {
		const bigint = parseInt(hex.replace('#', ''), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;

		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	getTransparentColor(color: string): string {
		return this.hexToRgba(color, 0.4, 1);
	}

	getSolidColor(color: string): string {
		return this.hexToRgba(color, 1, 0.8);
	}
}
