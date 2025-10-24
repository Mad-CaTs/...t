import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { marketingItemsNavigation, NAVIGATION_TEXTS } from '../../pages/commons/mocks/mock';
import { INavigation } from '@init-app/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ToolsService {
	constructor(private router: Router) {}

	getStepNavigation(currentStep: number): INavigation[] {
		return NAVIGATION_TEXTS.slice(0, currentStep);
	}

	getMarketingItemsNavigation(currentStep: number): INavigation[] {
		return marketingItemsNavigation.slice(0, currentStep);
	}

	/**
	 * Replace the text of a marketing navigation item by id.
	 * This mutates the shared `marketingItemsNavigation` mock so callers
	 * that read it afterwards will see the updated label.
	 */
	setMarketingItemTitleById(itemId: number, title: string) {
		// INavigation properties are readonly; perform an immutable replacement
		const idx = marketingItemsNavigation.findIndex((i) => i.id === itemId);
		if (idx >= 0) {
			marketingItemsNavigation.splice(idx, 1, {
				...marketingItemsNavigation[idx],
				text: title
			});
		}
	}

	navigateToStep(step: number, baseRoute: string, idImg?: number) {
		const route = idImg ? [`${baseRoute}/legalization-cards-component`, idImg] : [baseRoute];
		this.router.navigate(route);
	}

	/*  navigateToStep(step: number, baseRoute: string) {
    this.router.navigate([`${baseRoute}/${step}`]);
  } */
}
