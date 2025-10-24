import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Column } from '../../interfaces/guest-components.interface';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'guest-table',
	standalone: true,
	imports: [TableModule, CommonModule],
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss'
})
export class GuestTableComponent {
	@Input() data!: any[];
	@Input() columns!: Column[];
	@ContentChild('bodyTemplate', { static: false }) bodyTemplate: TemplateRef<any>;
}
