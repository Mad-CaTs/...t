import { DialogService } from 'primeng/dynamicdialog';
import { PopupModalComponent } from 'src/app/profiles/commons/components/popup-modal/popup-modal.component';
import { environment } from 'src/environments/environment';

export function preloadImage(url: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = url;
		img.onload = () => resolve();
		img.onerror = () => reject();
	});
}

export function openImageAlert(dialogService: DialogService, imagePath: string): void {
	const baseUrl = environment.URL_IMG.replace('bo-imagenes/', '');
	const fullImageUrl = `${baseUrl}${imagePath}`;

	preloadImage(fullImageUrl)
		.then(() => {
			dialogService.open(PopupModalComponent, {
				data: {
					imageUrl: fullImageUrl
				},
				styleClass: 'custom-alert-modal'
			});
		})
		.catch(() => {
			console.error('Error al cargar la imagen');
		});
}
