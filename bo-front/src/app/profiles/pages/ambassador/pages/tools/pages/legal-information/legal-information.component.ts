import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { STEP_ROUTES } from '../../commons/constants';
import { ToolsService } from '../../commons/services/tools.service';
import { CARDS_DATA, StepsNavigation } from '../commons/mocks/mock';
import { ICardData } from '../commons/interfaces';

@Component({
	selector: 'app-tools-overview',
	standalone: true,
	imports: [
		CommonModule,
		ConcatenateSrcDirective,
		NavigationComponent,
		MatCardModule,
		MatProgressBarModule,
		MatDividerModule
	],
	templateUrl: './legal-information.component.html',
	styleUrl: './legal-information.component.scss'
})
export default class LegalInformation {
	constructor(private router: Router, private toolsService: ToolsService) {}
	public currentStep = 2;
	cardsData: ICardData[] = CARDS_DATA;

	onChangeStep(newStep: number) {
		const route = STEP_ROUTES[newStep];
		if (route) {
			this.router.navigate([route]);
		}
	}

	get stepNavigation() {
		return this.toolsService.getStepNavigation(this.currentStep);
	}

	navigateToOverview(cardId: number) {
		this.router.navigate(['/profile/ambassador/tools/inresort'], { queryParams: { id: cardId } });
	}
}
