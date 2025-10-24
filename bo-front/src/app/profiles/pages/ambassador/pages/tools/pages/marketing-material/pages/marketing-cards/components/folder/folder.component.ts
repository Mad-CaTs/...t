import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
	selector: 'app-folder',
	standalone: true,
	imports: [CommonModule, MatIconModule, CardModule, DividerModule],
	templateUrl: './folder.component.html',
	styleUrls: ['./folder.component.scss']
})
export default class FolderComponent {
	@Input() headerIcon: string = 'insert_drive_file';
	@Input() title: string = '';
	@Input() content: string = '';
	@Input() buttonText: string = '';
	@Input() link: string = '';
	@Input() fileType: string = ''; // PDF, DOC, IMG, etc.
	@Input() fileCategory: string = 'individual'; //imagen, video, documento
	@Output() buttonClick = new EventEmitter<string>();

	onClickButton() {
		if (this.link) {
			const linkElement = document.createElement('a');
			linkElement.href = this.link;
			linkElement.download = this.extractFileName(this.link); // nombre sugerido
			linkElement.target = '_blank'; // abre en nueva pestaña si no descarga directo
			document.body.appendChild(linkElement);
			linkElement.click();
			document.body.removeChild(linkElement);
		}
	}

	// Método auxiliar para sacar el nombre del archivo
	private extractFileName(url: string): string {
		const parts = url.split('/');
		return parts[parts.length - 1];
	}
}
