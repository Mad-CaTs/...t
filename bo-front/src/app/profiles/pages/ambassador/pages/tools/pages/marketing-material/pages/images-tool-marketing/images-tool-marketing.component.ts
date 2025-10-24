import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolsService } from '../../../../commons/services/tools.service';
import { STEP_MARKETING_ROUTES } from '../../../../commons/constants';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { MatCardModule } from '@angular/material/card';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import { INavigation } from '@init-app/interfaces';
import { CARDS_IMAGES_TOOL } from '../../../commons/mocks/mock';
import { ICardData } from '../../../commons/interfaces';

@Component({
	selector: 'app-images-tool-marketing',
	standalone: true,
	imports: [CommonModule, NavigationComponent, MatCardModule, ConcatenateSrcDirective],
	templateUrl: './images-tool-marketing.component.html',
	styleUrl: './images-tool-marketing.component.scss'
})
export default class ImagesToolMarketingComponent {
	public currentStep = 4;
	cardId: number;
	inresortId?: number; // id del inresort de origen
	materialId?: number; // id del material de marketing de origen
	public cardsData: ICardData[] = [];

	constructor(private router: Router, private toolsService: ToolsService, private route: ActivatedRoute) {}
	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			// Prefer inresortId param, fallback to id
			this.inresortId = params['inresortId'] ? +params['inresortId'] : undefined;

			this.cardsData = this.getCardsImagesForResort(this.inresortId);
			this.cardId = +params['materialId'];
			this.materialId = this.cardId;
			// if we don't have inresortId, set it from id (legacy behavior)
			if (!this.inresortId && this.cardId) {
				this.inresortId = this.cardId;
			}

			if (this.cardId === 1) {
				this.currentStep = 4;
			} else if (this.cardId === 2) {
				this.currentStep = 4;
			}
		});
	}

	private getCardsImagesForResort(parentId: number): ICardData[] {
		switch (parentId) {
			case 1:
				return CARDS_IMAGES_TOOL.slice(0, 3);
			case 2:
				return [CARDS_IMAGES_TOOL.find((card) => card.id === 4)];
			case 3:
				return [CARDS_IMAGES_TOOL.find((card) => card.id === 5)]; // todas
			default:
				return [];
		}
	}

	get stepNavigation(): INavigation[] {
		const navigation = this.toolsService.getMarketingItemsNavigation(this.currentStep);

		return navigation;
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

	navigateToOverview(cardImageId: number, title?: string) {
		if (title) {
			this.toolsService.setMarketingItemTitleById(5, title);
		}

		const target = STEP_MARKETING_ROUTES[5] || '/profile/ambassador/tools/marketing-cards';

		// Build ordered query string: inresortId, materialId (if present), cardImageId
		const inresort =
			this.inresortId !== undefined && this.inresortId !== null ? this.inresortId : this.cardId || 1;
		const materialPart = this.cardId ? `&materialId=${encodeURIComponent(this.cardId)}` : '';
		const url = `${target}?inresortId=${encodeURIComponent(
			inresort
		)}${materialPart}&cardImageId=${encodeURIComponent(cardImageId)}`;

		this.router.navigateByUrl(url);
	}
}
