import { Injectable } from '@angular/core';
import {
	BehaviorSubject,
	combineLatest,
	distinctUntilChanged,
	filter,
	map,
	Observable,
	switchMap,
	tap
} from 'rxjs';
import { NewPartnerSelectPackageService } from '../../pages/new-partner-select-package/commons/service/new-partner-select-package.service';
import { CountryType } from '../../pages/new-partner-payment/commons/enums';

export interface NationalityState {
	nationalityId: number | null;
	residenceCountryCode: number | null;
}

@Injectable({
	providedIn: 'root'
})
export class NationalityStateService {
	private nationalitySubject = new BehaviorSubject<number | null>(null);
	private residenceSubject = new BehaviorSubject<number | null>(null);

	public state$: Observable<NationalityState> = combineLatest([
		this.nationalitySubject.asObservable(),
		this.residenceSubject.asObservable()
	]).pipe(
		distinctUntilChanged(([prevN, prevR], [currN, currR]) => prevN === currN && prevR === currR),
		tap(([nationality, residence]) => {
			console.log({ nationality, residence });
		}),
		map(([nationality, residence]) => ({
			nationalityId: nationality,
			residenceCountryCode: residence
		}))
	);

	constructor(private packageService: NewPartnerSelectPackageService) {}

	setNationality(nationalityId: number | null): void {
		this.nationalitySubject.next(nationalityId);
	}

	setResidence(countryCode: number | null): void {
		this.residenceSubject.next(countryCode);
	}

	reset(): void {
		this.nationalitySubject.next(null);
		this.residenceSubject.next(null);
	}

	private shouldSendForeignerFalse(nationality: number | null, residence: number | null): boolean {
		const isNationalityPeru = nationality === CountryType.PERU;
		const isResidencePeru = residence === CountryType.PERU;

		return isNationalityPeru || isResidencePeru;
	}

	public getFamilyPackages$(): Observable<any> {
		return this.state$.pipe(
			filter((state) => state.nationalityId !== null || state.residenceCountryCode !== null),
			switchMap((state) => {
				const shouldSendFalse = this.shouldSendForeignerFalse(
					state.nationalityId,
					state.residenceCountryCode
				);

				return shouldSendFalse
					? this.packageService.getFamilyPackage(false)
					: this.packageService.getFamilyPackage();
			}),
			tap((packages) => {
				console.log('paquetes cargados:', packages.length);
			})
		);
	}
}
