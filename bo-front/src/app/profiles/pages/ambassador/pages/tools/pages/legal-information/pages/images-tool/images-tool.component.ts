import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import LegalInformation from '../../legal-information.component';
import { ActivatedRoute, Router } from '@angular/router';
import { STEP_ROUTES } from '../../../../commons/constants';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { MatCardModule } from '@angular/material/card';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import { ToolsService } from '../../../../commons/services/tools.service';
import { INavigation } from '@init-app/interfaces';

@Component({
	selector: 'app-images-tool',
	standalone: true,
	imports: [CommonModule, LegalInformation, NavigationComponent, MatCardModule, ConcatenateSrcDirective],
	templateUrl: './images-tool.component.html',
	styleUrl: './images-tool.component.scss'
})
export default class ImagesToolComponent {
	public currentStep = 4;
	cardId: number;
	constructor(private router: Router, private toolsService: ToolsService, private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.cardId = +params['id'];

			if (this.cardId === 1) {
				this.currentStep = 4;
			} else if (this.cardId === 2) {
				this.currentStep = 4;
			}
		});
	}
	get stepNavigation(): INavigation[] {
		const navigation = this.toolsService.getStepNavigation(this.currentStep);

		// Modifica el texto del paso si cardId es 2
		if (this.cardId === 2) {
			return navigation.map((navItem) => {
				if (navItem.id === 4) {
					return { ...navItem, text: ' Documentos' };
				}
				return navItem;
			});
		}

		return navigation;
	}

	/*   get stepNavigation() {
		return this.toolsService.getStepNavigation(this.currentStep);
	}  */

	onChangeStep(newStep: number) {
		const route = STEP_ROUTES[newStep];
		if (route) {
			this.router.navigate([route]);
		}
	}

	navigateToOverview() {
		const idImg = 1;
		this.router.navigate(['/profile/ambassador/tools/legalization-cards-component', idImg]);
	}
}
