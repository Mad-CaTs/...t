import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PackagePortfolioSharingService {
	private navigationSource: 'package' | 'portfolio';
	private selectedPackageData = new BehaviorSubject<any>(null);
	private selectedPortfolio = new BehaviorSubject<any>(null);

	selectedPackage$ = this.selectedPackageData.asObservable();
	selectedPortfolio$ = this.selectedPortfolio.asObservable();

	setSelectedPackageData(packageData: any) {
		this.selectedPackageData.next(packageData);
		this.navigationSource = 'package';
		localStorage.setItem('selectedPackageData', JSON.stringify(packageData));
	}

	getSelectedPackageData() {
		let data = this.selectedPackageData.value;

		if (!data) {
			const storedData = localStorage.getItem('selectedPackageData');
			if (storedData) {
				data = JSON.parse(storedData);
				this.selectedPackageData.next(data);
			}
		}

		return data;

		/* 		return this.selectedPackageData.value;
		 */
	}

	setSelectedPortfolioData(portfolio: any) {
		this.selectedPortfolio.next(portfolio);
		this.navigationSource = 'portfolio';
		localStorage.setItem('selectedPortfolioData', JSON.stringify(portfolio));
	}

	getSelectedPortfolioData() {
		return this.selectedPortfolio.value;
	}
	getNavigationSource() {
		return this.navigationSource;
	}
}
