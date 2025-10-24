import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '../../../../commons/services/tools.service';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { STEP_MARKETING_ROUTES } from '../../../../commons/constants';
import { TabViewModule } from 'primeng/tabview';

import FolderComponent from './components/folder/folder.component';
import TabProfilesComponent from 'src/app/profiles/commons/components/tab-profiles/tab-profiles.component';
@Component({
	selector: 'app-marketing-cards',
	standalone: true,
	imports: [CommonModule, NavigationComponent, FolderComponent, TabViewModule, TabProfilesComponent],
	templateUrl: './marketing-cards.component.html',
	styleUrl: './marketing-cards.component.scss'
})
export default class MarketingCardsComponent {
	constructor(private router: Router, private toolsService: ToolsService, private route: ActivatedRoute) {}

	inresortId?: number;
	activeTab = 1;
	profileTabs: { label: string; isActive: boolean; tabAction: () => void }[];
	cardId: number;
	public currentStep = 5;

	// grouped cards for Images / Files
	public imageCards: any[] = [];
	public fileCards: any[] = [];
	public videoCards: any[] = [];

	// primary/secondary arrays used by the template (tab1/tab2)
	public primaryCards: any[] = [];
	public secondaryCards: any[] = [];

	get stepNavigation() {
		return this.toolsService.getMarketingItemsNavigation(this.currentStep);
	}

	ngOnInit() {
		// default tabs — labels may be replaced in subscription when params arrive
		this.profileTabs = [
			{ label: 'Videos', isActive: true, tabAction: () => this.setTab(1) },
			{ label: 'Imagenes', isActive: false, tabAction: () => this.setTab(2) }
		];

		this.route.queryParams.subscribe((params) => {
			// Prefer inresortId param, fallback to id
			this.inresortId = params['inresortId'] ? +params['inresortId'] : undefined;

			this.cardId =
				params['materialId'] !== undefined && params['materialId'] !== null
					? +params['materialId']
					: undefined;
			const hasCardImage = params['cardImageId'] !== undefined && params['cardImageId'] !== null;
			// if we don't have inresortId, set it from id (legacy behavior)
			if (!this.inresortId && this.cardId) {
				this.inresortId = this.cardId;
			}

			if (this.cardId === 1) {
				this.currentStep = 4;
			} else if (this.cardId === 2) {
				this.currentStep = 4;
			}

			// Group cards by `content` value
			const lower = (s: string) => (s || '').toLowerCase();
			this.imageCards = this.cardsData.filter((c) => lower(c.content) === 'imagen');
			this.fileCards = this.cardsData.filter((c) => lower(c.content) === 'archivo');
			this.videoCards = this.cardsData.filter(
				(c) => lower(c.content) === 'video' || (c.title || '').toLowerCase().includes('video')
			);

			// Determine tab labels and which groups to show based on materialId
			const mId = this.cardId;
			if (mId === 1) {
				// material 1 -> Imágenes / Archivos
				this.profileTabs = [
					{ label: 'Imágenes', isActive: true, tabAction: () => this.setTab(1) },
					{ label: 'Archivos', isActive: false, tabAction: () => this.setTab(2) }
				];
				this.primaryCards = this.imageCards;
				this.secondaryCards = this.fileCards;
				this.activeTab = 1;
			} else if (mId === 2) {
				// material 2 -> Videos / Imágenes
				this.profileTabs = [
					{ label: 'Videos', isActive: true, tabAction: () => this.setTab(1) },
					{ label: 'Imágenes', isActive: false, tabAction: () => this.setTab(2) }
				];
				this.primaryCards = this.videoCards;
				this.secondaryCards = this.imageCards;
				this.activeTab = 1;
			} else if (mId === 3) {
				// material 3 -> Imágenes / Archivos (same as 1)
				this.profileTabs = [
					{ label: 'Imágenes', isActive: true, tabAction: () => this.setTab(1) },
					{ label: 'Archivos', isActive: false, tabAction: () => this.setTab(2) }
				];
				this.primaryCards = this.imageCards;
				this.secondaryCards = this.fileCards;
				this.activeTab = 1;
			} else if (mId === 4) {
				// material 4 -> Imágenes / Videos
				this.profileTabs = [
					{ label: 'Imágenes', isActive: true, tabAction: () => this.setTab(1) },
					{ label: 'Videos', isActive: false, tabAction: () => this.setTab(2) }
				];
				this.primaryCards = this.imageCards;
				this.secondaryCards = this.videoCards;
				this.activeTab = 1;
			} else {
				// default labels: Videos / Imágenes
				this.profileTabs = [
					{ label: 'Videos', isActive: true, tabAction: () => this.setTab(1) },
					{ label: 'Imagenes', isActive: false, tabAction: () => this.setTab(2) }
				];
				this.primaryCards = this.videoCards;
				this.secondaryCards = this.imageCards;
			}
		});
	}

	setTab(id: number) {
		this.activeTab = id;
		this.profileTabs = this.profileTabs.map((t, i) => ({
			...t,
			isActive: i + 1 === id
		}));
	}

	onChangeStep(newStep: number) {
		// ignore clicks on the active step
		if (newStep === this.currentStep) {
			return;
		}

		const route = STEP_MARKETING_ROUTES[newStep];
		if (!route) {
			return;
		}

		const queryParams: Record<string, any> = {};
		if (this.inresortId !== undefined && this.inresortId !== null) {
			queryParams['inresortId'] = this.inresortId;
		}
		if (this.cardId !== undefined && this.cardId !== null) {
			queryParams['materialId'] = this.cardId;
		}

		if (Object.keys(queryParams).length) {
			this.router.navigate([route], { queryParams });
		} else {
			this.router.navigate([route]);
		}
	}

	cardsData = [
		{
			id: 1,
			title: 'Inclub 2025 proyectos y oportunidades',
			content: 'imagen',
			icon: 'photo',
			buttonText: 'Descargar',
			fileType: 'PNG',
			fileCategory: 'individual',
			link: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-intech&portada.png'
		},
		{
			id: 2,
			title: 'Inversiones Inresorts',
			content: 'imagen',
			icon: 'folder',
			buttonText: 'Descargar',
			fileType: 'PNG',
			fileCategory: 'paquete',
			link: '/profile/ambassador/tools/legal-information'
		},
		{
			id: 3,
			title: 'Triptico Inresorts',
			content: 'archivo',
			icon: 'picture_as_pdf',
			buttonText: 'Descargar',
			fileType: 'PDF',
			fileCategory: 'individual',
			link: '/profile/ambassador/tools/faq-section'
		},
		{
			id: 4,
			title: 'Tutoriales',
			content: 'archivo',
			icon: 'folder',
			buttonText: 'Descargar',
			fileType: 'Documentos',
			fileCategory: 'paquete',
			link: '/profile/ambassador/tools/tutorials'
		},
		{
			id: 5,
			title: 'Legalidad',
			content: 'video',
			icon: 'movie',
			buttonText: 'Descargar',
			fileType: 'MP4',
			fileCategory: 'individual',
			link: '/profile/ambassador/tools/legal-information'
		},
		{
			id: 6,
			title: 'Preguntas frecuentes',
			content: 'video',
			icon: 'movie',
			buttonText: 'Descargar',
			fileType: 'MP4',
			fileCategory: 'individual',
			link: '/profile/ambassador/tools/faq-section'
		}
	];
}
