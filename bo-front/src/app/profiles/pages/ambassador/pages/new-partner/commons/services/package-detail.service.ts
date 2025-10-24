import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SelectedPackageService {
	private packageSubject$: Subject<any> = new Subject<any>();
	private packageDetailSubject$: Subject<any> = new Subject<any>();
	public selectedPackage: any;
	public selectedPackageDetail: any;

	constructor() {}

	public setSelectedPackageData(selectedPackage: any) {
		this.selectedPackageData(selectedPackage);
		this.selectedPackageDetailData(selectedPackage?.packageDetail[0]);
	}

	public selectedPackageData(selectedPackage) {
		this.selectedPackage = selectedPackage;
		this.packageSubject$.next(this.selectedPackage);
	}

	getSelectedPackageData$(): Observable<any> {
		return this.packageSubject$.asObservable();
	}

	public selectedPackageDetailData(selectedPackageDetail) {
		this.selectedPackageDetail = selectedPackageDetail;
		this.packageDetailSubject$.next(this.selectedPackageDetail);
    
	}

	getSelectedPackageDetailData$(): Observable<any> {
		return this.packageDetailSubject$.asObservable();
	}
}
