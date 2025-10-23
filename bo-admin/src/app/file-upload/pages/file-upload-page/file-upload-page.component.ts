import { Component } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-file-upload-page',
	templateUrl: './file-upload-page.component.html',
	styleUrls: ['./file-upload-page.component.scss'],
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet]
})
export class FileUploadPageComponent {
	public readonly navigationData = [
		{ path: '/dashboard/file-upload/file-upload', name: 'Cargar Archivos Bancarios' },
		{ path: '/dashboard/file-upload/file-upload/vouchers', name: 'Vouchers' }
	];
}
