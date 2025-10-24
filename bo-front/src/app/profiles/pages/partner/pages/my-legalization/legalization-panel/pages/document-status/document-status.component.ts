import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardProductComponent } from '../../../../my-products/pages/product/commons/components/card-product/card-product.component';
import { MatIconModule } from '@angular/material/icon';
import { LegalizationRequestService } from './commons/services/legalization-request-service';
import { getStatusColor } from './commons/constans';
import { DocumentRequestListComponent } from './pages/document-request-list/document-request-list.component';

@Component({
	selector: 'app-document-status',
	standalone: true,
	imports: [CommonModule, DocumentRequestListComponent],
	templateUrl: './document-status.component.html',
	styleUrl: './document-status.component.scss'
})
export class DocumentStatusComponent  {

	

}
