import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { STEP_MARKETING_ROUTES } from '../../commons/constants';
import { ToolsService } from '../../commons/services/tools.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { marketingItemsNavigation } from '../../commons/mocks/mock';
import { Location } from '@angular/common';
import { ICardData } from '../commons/interfaces';
import { CARDS_MARKETING_DATA } from '../commons/mocks/mock';
import { MatCardModule } from '@angular/material/card';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
@Component({
	selector: 'app-marketing-material',
	standalone: true,
	imports: [CommonModule, NavigationComponent, MatCardModule, ConcatenateSrcDirective],
	templateUrl: './marketing-material.component.html',
	styleUrl: './marketing-material.component.scss'
})
export default class MarketingMaterialComponent {
	public currentStep = 2;
	cardsData: ICardData[] = CARDS_MARKETING_DATA;

	constructor(private router: Router, private toolsService: ToolsService, private location: Location) {}

	onChangeStep(newStep: number) {
		// If the selected step is already active, do nothing to avoid redundant navigation
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

	navigateToOverview(cardId: number, title?: string) {
		// If a title is provided, replace marketing navigation item id=3 (Inresorts)
		if (title) {
			this.toolsService.setMarketingItemTitleById(3, title);
		}

		// Navigate to inresorts-marketing and pass the inresortId explicitly
		this.router.navigate(['/profile/ambassador/tools/inresorts-marketing'], {
			queryParams: { inresortId: cardId }
		});
	}
}
