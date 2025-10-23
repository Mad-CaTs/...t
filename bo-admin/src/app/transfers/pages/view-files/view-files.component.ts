import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ITableTransferRequest } from '@interfaces/transfer.interface';
import { SafeUrlPipe } from '@app/transfers/utils/safe-url.pipe';
import { ModalAcceptPaymentComponent } from '@shared/components/modal-accept-payment/modal-accept-payment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalObservationTransferComponent } from './modals/modal-observation/modal-observation-transfer.component';

@Component({
	selector: 'app-view-files',
	standalone: true,
	imports: [CommonModule, RouterModule, SafeUrlPipe],
	templateUrl: './view-files.component.html',
	styleUrls: ['./view-files.component.scss']
})
export class ViewFilesComponent implements OnInit {
	transferId: string | null = null;
	@Output() back = new EventEmitter<void>();
	@Input() rowData!: ITableTransferRequest;
	documents: { key: string; label: string; files: string[]; filename: string }[] = [];
	selectedDocKey: string = 'dni';

	constructor(
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private cdr: ChangeDetectorRef
	) {
		this.transferId = this.route.snapshot.paramMap.get('id');
	}

	ngOnChanges(): void {
		if (this.rowData) {
			this.documents = [
				{
					key: 'dni',
					label: 'Documento de identidad del titular',
					filename: this.extractFilename(this.rowData.dni_url ?? ''),
					files: [this.rowData.dni_url ?? '']
				},
				{
					key: 'constancia',
					label: 'Documento de identidad del socio a traspasar',
					filename: this.extractFilename(this.rowData.dni_receptor_url ?? ''),
					files: [this.rowData.dni_receptor_url ?? '']
				},
				{
					key: 'dj',
					label: 'Declaración jurada (DJ)',
					filename: this.extractFilename(this.rowData.declaration_jurada_url ?? ''),
					files: [this.rowData.declaration_jurada_url ?? '']
				}
			];
		}
	}

	private extractFilename(url: string): string {
		if (!url) return '';
		return url.split('/').pop() || '';
	}

	ngOnInit(): void {
		this.selectedDocKey = this.documents[0].key;
	}

	get previewFiles(): string[] {
		const doc = this.documents.find((d) => d.key === this.selectedDocKey);
		return doc ? doc.files : [];
	}

	selectDocument(key: string) {
		this.selectedDocKey = key;
	}

	goBack() {
		this.back.emit();
	}

	public onConfirmaObservado(): void {
		const modalRef = this.modalService.open(ModalObservationTransferComponent, {
			centered: true,
			size: 'md'
		});
		const modal = modalRef.componentInstance as ModalObservationTransferComponent;
		modalRef.componentInstance.transfer = this.rowData;
	}
}
