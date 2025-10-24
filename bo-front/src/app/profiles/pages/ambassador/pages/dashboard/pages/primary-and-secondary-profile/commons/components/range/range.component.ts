import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardService } from '../../services/dashboard.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import ProgressIconComponent from '../progress-icon/progress-icon.component';

@Component({
	selector: 'app-range',
	templateUrl: './range.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule, ProgressSpinnerModule, ProgressIconComponent],
	styleUrls: ['./range.component.scss']
})
export class RangeComponent implements OnInit {
	@Input() withoutBox: boolean = false;
	@Input() withoutTitle: boolean = false;
	@Input() noIndicators: boolean = false;
	@Input() tipo: 'Compuesto' | 'Residual';

	@Input() rangeData: any;
	@Input() nextRangeData: any;
	@Input() pointRangesData: any;
	@Input() isDataLoaded: boolean = false;
	public isLoading: boolean = true;
	public maxRange: string = '';
	public range: string = '';
	public nextRange: string = '';
	public imageRange: string = '';
	public imageMaxRange: string = '';
	public nextRangeImage: string = '';
	public averagePercentage: number | null = null;

	constructor(private registry: MatIconRegistry, private sanitizer: DomSanitizer) {
		this.registry.addSvgIcon('award', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/award.svg'));
		this.registry.addSvgIcon(
			'percentaje',
			sanitizer.bypassSecurityTrustResourceUrl('assets/icons/Percentaje.svg')
		);
	}

	ngOnInit(): void {
		this.checkAndSetData();
	}

	checkAndSetData(): void {
		if (this.rangeData && this.nextRangeData && this.pointRangesData) {
			this.setRangeData();
			this.setNextRangeData();
			this.setPointsRangeData();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		const rangeDataChanged = changes['rangeData'] && changes['rangeData'].currentValue;
		const nextRangeDataChanged = changes['nextRangeData'] && changes['nextRangeData'].currentValue;
		const pointRangesDataChanged = changes['pointRangesData'] && changes['pointRangesData'].currentValue;

		if (rangeDataChanged || nextRangeDataChanged || pointRangesDataChanged) {
			if (this.rangeData && this.nextRangeData && this.pointRangesData) {
				this.checkAndSetData();
			}
			this.isLoading = false;
		}
	}

	setRangeData(): void {
		if (this.rangeData) {
			if (this.tipo === 'Compuesto') {
				this.range = this.rangeData.rango ?? '';
				this.maxRange = this.rangeData.maxCompoundRange ?? '';
				this.imageRange = this.formatRangeName(this.rangeData.rango);
				this.imageMaxRange = this.formatRangeName(this.rangeData.maxCompoundRange);
			} else if (this.tipo === 'Residual') {
				this.range = this.rangeData.rangoResidual ?? '';
				this.maxRange = this.rangeData.maxResidualRange ?? '';
				this.imageRange = this.formatRangeName(this.rangeData.rangoResidual);
				this.imageMaxRange = this.formatRangeName(this.rangeData.maxResidualRange);
			}
		}
		this.isLoading = false;
	}

	setNextRangeData(): void {
		if (this.nextRangeData) {
			if (this.tipo === 'Compuesto') {
				this.nextRange = this.nextRangeData.nextCompoundRange ?? '';
				this.nextRangeImage = this.formatRangeName(this.nextRangeData.nextCompoundRange);
			} else if (this.tipo === 'Residual') {
				this.nextRange = this.nextRangeData.nextResidualRange ?? '';
				this.nextRangeImage = this.formatRangeName(this.nextRangeData.nextResidualRange);
			}
		}
	}

	private formatRangeName(rangeName: string): string {
		if (!rangeName) {
			return '';
		}
		if (rangeName === 'DOBLE DIAMANTE') {
			return 'DobleDiamante';
		}
		if (rangeName === 'TRIPLE DIAMANTE') {
			return 'TripleDiamante';
		}
		if (rangeName === 'Embajador de Marca') {
			return 'EmbajadordeMarca';
		}
		return rangeName.toLowerCase();
	}

	
	setPointsRangeData(): void {
		if (this.pointRangesData) {
			const data = Array.isArray(this.pointRangesData) ? this.pointRangesData[0] : this.pointRangesData;
			const percentagesNextRange = data.percentagesNextRange;
			if (!percentagesNextRange) {
				this.averagePercentage = null;
				return;
			}
			let promedio: number = 0;
			if (this.tipo === 'Compuesto') {
				const rama1 = percentagesNextRange.percetangeRama1CompoundRange;
				const rama2 = percentagesNextRange.percetangeRama2CompoundRange;
				const rama3 = percentagesNextRange.percetangeRama3CompoundRange;
				promedio = (rama1 + rama2 + rama3) / 3;
			} else if (this.tipo === 'Residual') {
				const rama1 = percentagesNextRange.percetangeRama1ResidualRange;
				const rama2 = percentagesNextRange.percetangeRama2ResidualRange;
				const rama3 = percentagesNextRange.percetangeRama3ResidualRange;
				promedio = (rama1 + rama2 + rama3) / 3;
			}
			this.averagePercentage = promedio;
		} else {
			this.averagePercentage = null;
		}
	}
}
