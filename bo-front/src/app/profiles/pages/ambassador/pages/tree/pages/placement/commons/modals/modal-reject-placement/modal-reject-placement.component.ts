import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-modal-reject-placement',
	templateUrl: './modal-reject-placement.component.html',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, ModalComponent],
	styleUrls: []
})
export class ModalRejectPlacementComponent implements OnInit {

	constructor(

	) {}

	ngOnInit(): void {

	}

}