import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
	selector: 'app-document-not-available-modal',
	standalone: true,
	imports: [CommonModule, InlineSVGModule],
	  templateUrl: './document-not-available-modal.component.html',
	  styleUrls: ['./document-not-available-modal.component.scss'],

})
export class DocumentNotAvailableModalComponent {
	@Input() title: string = 'Documento no disponible';
	@Input() message: string = 'No hay documento disponible para mostrar.';

	constructor(public activeModal: NgbActiveModal) {}
}
