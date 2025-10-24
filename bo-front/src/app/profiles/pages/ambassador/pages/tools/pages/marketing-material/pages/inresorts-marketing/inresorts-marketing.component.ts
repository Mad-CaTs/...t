import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICardData, ICardDataImgDoc } from '../../../commons/interfaces';
import { CARDS_DATA_IMG_MARKETING_DOC, CARDS_MARKETING_DATA } from '../../../commons/mocks/mock';
import { ToolsService } from '../../../../commons/services/tools.service';
import { ActivatedRoute, Router } from '@angular/router';
import { STEP_MARKETING_ROUTES } from '../../../../commons/constants';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import CardComponent from '../../../../commons/componets/card/card.component';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';

@Component({
	selector: 'app-inresorts-marketing',
	standalone: true,
	imports: [CommonModule, NavigationComponent, CardComponent, ConcatenateSrcDirective],
	templateUrl: './inresorts-marketing.component.html',
	styleUrl: './inresorts-marketing.component.scss'
})
export default class InresortsMarketingComponent implements OnInit {
	public currentStep = 3;
	cardData: ICardData;
	public cardsData: ICardDataImgDoc[] = [];

	constructor(private route: ActivatedRoute, private router: Router, private toolsService: ToolsService) {}

	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			// Accept both inresortId (explicit) or id (legacy)
			const inresortId = params['inresortId'] ? +params['inresortId'] : +params['id'];
			this.cardData = CARDS_MARKETING_DATA.find((card) => card.id === inresortId);
			this.cardsData = this.getCardsForParent(inresortId);
		});
	}

	private getCardsForParent(parentId: number): ICardDataImgDoc[] {
		switch (parentId) {
			case 1:
				return CARDS_DATA_IMG_MARKETING_DOC.slice(); // todas
			case 2:
				return CARDS_DATA_IMG_MARKETING_DOC.slice(0, 3);
			case 3:
				return CARDS_DATA_IMG_MARKETING_DOC.slice(); // todas
			default:
				return CARDS_DATA_IMG_MARKETING_DOC.slice();
		}
	}

	onChangeStep(newStep: number) {
		if (newStep === this.currentStep) {
			return;
		}

		const route = STEP_MARKETING_ROUTES[newStep];
		if (route) {
			this.router.navigate([route]);
		}
	}

	get stepNavigation() {
		return this.toolsService.getMarketingItemsNavigation(this.currentStep);
	}

	navigateToComponent(id: number, title?: string) {
		if (title) {
			this.toolsService.setMarketingItemTitleById(4, title);
		}

		const inresortId = this.cardData?.id;

		this.router.navigate(['/profile/ambassador/tools/images-tool-marketing'], {
			queryParams: { inresortId, materialId: id }
		});
	}
}
