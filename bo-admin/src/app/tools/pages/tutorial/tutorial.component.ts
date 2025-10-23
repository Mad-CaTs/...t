import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TutorialService } from '@app/tools/services/tutorial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
	selector: 'app-tutorial',
	templateUrl: './tutorial.component.html',
	styleUrls: ['./tutorial.component.scss'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule]
})
export class TutorialComponent {
	@ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
	@ViewChild('successModal') successModal!: TemplateRef<any>;
	@ViewChild('errorModal') errorModal!: TemplateRef<any>;
	@ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;

	tutoriales: any[] = [];
	tutorialToDelete: any = null;
	tutorialForm: FormGroup;
	previewImage: string | null = null; // <- almacena imagen si se puede mostrar preview
	isGenericLink = false; // <- indica si es un link válido pero sin preview posible
	isSaving = false;
	isDeleting = false;

	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		private tutorialService: TutorialService,
		private cdr: ChangeDetectorRef
	) {
		this.tutorialForm = this.fb.group({
			title: ['', Validators.required],
			url: ['', [Validators.required, Validators.pattern('https?://.+')]]
		});
	}

	ngOnInit(): void {
		this.loadTutorials();
	}

	loadTutorials(): void {
		this.tutorialService.getAllTutorials().subscribe({
			next: (response) => {
				this.tutoriales = response.data;
				console.log('Tutoriales cargados:', this.tutoriales);
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Error al cargar tutoriales:', err);
			}
		});
	}

	onCreateTutorial(): void {
		this.modalService.open(this.modalContent, {
			centered: true,
			backdrop: 'static',
			size: 'lg',
			windowClass: 'custom-modal'
		});
	}

	saveTutorial(modal: any): void {
		if (this.tutorialForm.invalid || this.isSaving) return;

		this.isSaving = true;
		const tutorial = this.tutorialForm.value;

		this.tutorialService.createTutorial(tutorial).subscribe({
			next: () => {
				this.loadTutorials();
				this.resetTutorialForm();
				modal.close();
				this.modalService.open(this.successModal, {
					centered: true,
					backdrop: 'static',
					windowClass: 'custom-modal'
				});
			},
			error: (err) => {
				console.error('Error al crear tutorial:', err);
				this.modalService.open(this.errorModal, {
					centered: true,
					backdrop: 'static',
					windowClass: 'custom-modal'
				});
			},
			complete: () => {
				this.isSaving = false;
			}
		});
	}

	onCancelTutorial(modal: any): void {
		this.resetTutorialForm();
		modal.dismiss('cancel');
	}

	private resetTutorialForm(): void {
		this.tutorialForm.reset(); // limpia el formulario
		this.previewImage = null; // limpia la vista previa
		this.isGenericLink = false;
	}

	getThumbnail(url: string): string {
		const youtubeId = this.extractYoutubeVideoId(url);
		if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/0.jpg`;

		const driveId = this.extractDriveFileId(url);
		if (driveId) return `https://drive.google.com/uc?export=view&id=${driveId}`;

		return 'https://via.placeholder.com/60x60.png?text=Link'; // genérico
	}

	getHostName(url: string): string {
		try {
			return new URL(url).hostname.replace('www.', '');
		} catch {
			return 'enlace.com';
		}
	}

	verTutorial(url: string): void {
		window.open(url, '_blank');
	}

	openDeleteModal(tutorial: any): void {
		this.tutorialToDelete = tutorial;
		this.modalService.open(this.confirmDeleteModal, {
			centered: true,
			backdrop: 'static',
			windowClass: 'custom-modal'
		});
	}

	confirmDelete(modal: any): void {
		if (!this.tutorialToDelete?.id || this.isDeleting) return;

		this.isDeleting = true;

		this.tutorialService.deleteTutorial(this.tutorialToDelete.id).subscribe({
			next: () => {
				this.loadTutorials();
				this.tutorialToDelete = null;
				modal.close();

				this.modalService.open(this.successModal, {
					centered: true,
					backdrop: 'static',
					windowClass: 'custom-modal'
				});
			},
			error: (err) => {
				console.error('Error al eliminar tutorial:', err);

				this.modalService.open(this.errorModal, {
					centered: true,
					backdrop: 'static',
					windowClass: 'custom-modal'
				});
			},
			complete: () => {
				this.isDeleting = false;
			}
		});
	}

	// ✅ Detecta el tipo de enlace y genera vista previa si aplica
	onUrlChange(): void {
		const url = this.tutorialForm.get('url')?.value?.trim();
		this.previewImage = null;
		this.isGenericLink = false;

		if (!url) return;

		const youtubeId = this.extractYoutubeVideoId(url);
		if (youtubeId) {
			this.previewImage = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
			return;
		}

		if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
			this.previewImage = url;
			return;
		}

		const driveId = this.extractDriveFileId(url);
		if (driveId) {
			this.previewImage = `https://drive.google.com/uc?export=view&id=${driveId}`;
			return;
		}

		this.isGenericLink = true; // válido pero sin preview
	}

	// Extrae ID de YouTube si aplica
	private extractYoutubeVideoId(url: string): string | null {
		const regex =
			/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|watch)\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	}

	// Extrae ID de archivo de Drive si es archivo (no carpeta)
	private extractDriveFileId(url: string): string | null {
		const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//);
		return match ? match[1] : null;
	}
}
