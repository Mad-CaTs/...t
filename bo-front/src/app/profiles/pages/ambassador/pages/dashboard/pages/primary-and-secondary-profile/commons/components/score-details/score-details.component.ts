import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointRangesData } from 'src/app/profiles/pages/ambassador/pages/tree/pages/range-manager/commons/interfaces';
import { Colors } from '../../interfaces/dashboard.interface';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

export interface ScoreItem {
  points: number;
  maxPoints: number;
  label: string;
  category: string;
}

export interface RankData {
  name: string;
  icon: string;
  isCurrentRank: boolean;
  scores: ScoreItem[];
}
@Component({
  selector: 'app-score-details',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './score-details.component.html',
  styleUrl: './score-details.component.scss'
})
export class ScoreDetailsComponent {
  @Input() getColorByRangeId?: (rangeId: number) => string;
  @Input() getTextColorByRangeId?: (rangeId: number) => string;
  @Input() getGradientColor?: (rangeId: number) => string;
  @Input() colors: Colors[] = [];
  @Input() pointRangesDataToChild: PointRangesData[] = [];
  @Input() nextRangeData: any = null;
  @Input() rangeData: any = null;
  @Input() isDataLoaded: boolean = false;
  @Input() typeOfRange: 'Composite' | 'Residual';
  @Input() typeOfLevel: 'Current' | 'Next';
  @Input() currentRangeTitle: string = '';
  @Input() cardLoading: boolean;
  public isLoading: boolean = false;
  public maxRange: string = '';
  public range: string = '';
  public nextRange: string = '';
  public imageRange: string = '';
  public imageMaxRange: string = '';
  public nextRangeImage: string = '';
  public averagePercentage: number | null = null;
  public sizeOfBorderButton = 3;

  checkAndSetData(): void {
    if (this.rangeData && this.nextRangeData && this.pointRangesDataToChild, this.colors) {
      this.setRangeData();
      this.setNextRangeData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const rangeDataChanged = changes['rangeData'] && changes['rangeData'].currentValue;
    const nextRangeDataChanged = changes['nextRangeData'] && changes['nextRangeData'].currentValue;
    const pointRangesDataChanged = changes['pointRangesDataToChild'] && changes['pointRangesDataToChild'].currentValue;
    const colorsChanged = changes['colors'] && changes['colors'].currentValue;

    
    if (rangeDataChanged || nextRangeDataChanged || pointRangesDataChanged || colorsChanged) {
      if (this.rangeData && this.nextRangeData && this.pointRangesDataToChild && this.colors) {
        this.checkAndSetData();
      }
      this.isLoading = false;
    }
  }

  setRangeData(): void {
    if (this.rangeData) {
      if (this.typeOfRange === 'Composite') {
        this.range = this.rangeData.rango ?? '';
        this.maxRange = this.rangeData.maxCompoundRange ?? '';
        this.imageRange = this.formatRangeName(this.rangeData.rango);
        this.imageMaxRange = this.formatRangeName(this.rangeData.maxCompoundRange);
      } else if (this.typeOfRange === 'Residual') {
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
      if (this.typeOfRange === 'Composite') {
        this.nextRange = this.nextRangeData.nextCompoundRange ?? '';
        this.nextRangeImage = this.formatRangeName(this.nextRangeData.nextCompoundRange);
      } else if (this.typeOfRange === 'Residual') {
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

  get volumnDirectRamCompound() {
    const range = this.pointRangesDataToChild[0]?.percentagesActualRange
    const volumnRamCompound = range?.volumeDirectCompound <= range?.volumeDirectCompoundRange ? range?.volumeDirectCompound : range?.volumeDirectCompoundRange;
    return volumnRamCompound;
  }
  
  get volumnNextDirectRamCompound() {
    const range = this.pointRangesDataToChild[0]?.percentagesNextRange;
    const volumnRamNextCompound = range?.volumeDirectCompound <= range?.volumeDirectCompoundRange ? range?.volumeDirectCompound : range?.volumeDirectCompoundRange;
    return volumnRamNextCompound;
  }

  get volumnDirectRamResidual () {
    const range = this.pointRangesDataToChild[0]?.percentagesActualRange;
    const volumnRamrResidual = range?.volumeDirectResidual <= range?.volumeDirectResidualRange ? range?.volumeDirectResidual : range?.volumeDirectResidualRange;
    return volumnRamrResidual;
  }


  get volumnNextDirectRamResidual() {
    const range = this.pointRangesDataToChild[0]?.percentagesNextRange;
    const volumnRamNextResidual = range?.volumeDirectResidual <= range?.volumeDirectResidualRange ? range?.volumeDirectResidual : range?.volumeDirectResidualRange;
    return volumnRamNextResidual;
  }
}


