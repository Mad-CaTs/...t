import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import ToolsComponent from '../../../../tools.component';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import CardComponent from '../../../../commons/componets/card/card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { STEP_ROUTES } from '../../../../commons/constants';
import { ToolsService } from '../../../../commons/services/tools.service';
import { CARDS_DATA, CARDS_DATA_IMG_DOC } from '../../../commons/mocks/mock';
import { ICardData } from '../../../commons/interfaces';

@Component({
	selector: 'app-inresort',
	standalone: true,
	imports: [CommonModule, NavigationComponent, ToolsComponent, ConcatenateSrcDirective, CardComponent],
	templateUrl: './inresort.component.html',
	styleUrl: './inresort.component.scss'
})
export default class InresortComponent implements OnInit {
	public currentStep = 3;
	cardData: ICardData;
	public cardsData = CARDS_DATA_IMG_DOC;

	constructor(private route: ActivatedRoute, private router: Router, private toolsService: ToolsService) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			const cardId = +params['inresortId'];

			this.cardData = CARDS_DATA.find((card) => card.id === cardId);
		});
	}

	onChangeStep(newStep: number) {
		const route = STEP_ROUTES[newStep];
		if (route) {
			this.router.navigate([route]);
		}
	}

	get stepNavigation() {
		return this.toolsService.getStepNavigation(this.currentStep);
	}

	navigateToComponent(id: number, title: string) {
		this.router.navigate(['/profile/ambassador/tools/images-tool'], { queryParams: { inresortId: id } });
	}
}
