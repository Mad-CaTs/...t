import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { ModalAccountTreeRangesDetailComponent } from './commons/modals/modal-account-tree-ranges-detail/modal-account-tree-ranges-detail.component';
import { ModalAccountTreeOrganizationManagerComponent } from './commons/modals/modal-account-tree-organization-manager/modal-account-tree-organization-manager.component';
import { CommonModule } from '@angular/common';
import { TableAccountTreeRangesComponent } from './commons/components/table-account-tree-ranges/table-account-tree-ranges.component';
import { TableAccountOrganizationManagerComponent } from './commons/components/table-account-organization-manager/table-account-organization-manager.component';
import { TableAccountTreeRangesResidualComponent } from './commons/components/table-account-tree-ranges-residual/table-account-tree-ranges-residual.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PeriodCompoundService } from './commons/services/period-compound.service';
import { PeriodResidualService } from './commons/services/period-residual.service';
import { AchievementsSectionComponent } from './commons/components/achievements-section/achievements-section.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { getMedalImage } from './commons/constants';
import { TreeService } from '../../commons/services/tree.service';
import { IPaginationListPartner } from '../../commons/interfaces/pagination';
import { PartnerListResponseDTO } from '../../commons/interfaces/partnerList';
import { MatIconModule } from '@angular/material/icon';
import { EmeraldComponent } from './commons/components/achievements-section/emerald/emerald.component';
import { PartnerBonusApiService } from './commons/services/partner-bonus.service';
import { Subscription, filter } from 'rxjs';
import type { IResponseData } from '@shared/interfaces/api-request';
import type { PartnerBonus } from './commons/interfaces/partner-bonus.interface';
import { historyRangeNavigationMock } from './commons/mocks/mock';
import { MyRewardsCardComponent } from './commons/components/my-rewards/commons/components/my-rewards-card/my-rewards-card.component';
import { MyRewardsComponent } from './commons/components/my-rewards/my-rewards.component';
import { MyAwardsComponent } from '../my-awards/my-awards.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-history-range',
  templateUrl: './history-range.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    TableAccountTreeRangesComponent,
    TableAccountTreeRangesResidualComponent,
    TableAccountOrganizationManagerComponent,
    AchievementsSectionComponent,
    MyRewardsCardComponent,
    ProgressSpinnerModule,
    MyRewardsComponent,
    MyAwardsComponent,
    MatIconModule,
    EmeraldComponent,
    RouterOutlet
  ],
  styleUrls: ['./history-range.component.scss']
})
export default class HistoryRangeComponent {
  public currentTab: number = 1;
  isLoading: boolean = false;
  public navigation = historyRangeNavigationMock;
  public childActive = false;

  public rangeTableData: any[] = [];
  public rangeResidualTableData: any[] = [];
  public organizationTableData: any[] = [];

  totalRecords: number = 0;
  totalRecordsResidual: number = 0;
  totalRecordsCompound: number = 0;

  pageCompound: number = 1;
  rowsCompound: number = 10;

  pageResidual: number = 1;
  rowsResidual: number = 10;
  ranks: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  historicData: any;
  userInfo: any;
  activeRangeIds: string[] = [];
  bodyTree: IPaginationListPartner = new IPaginationListPartner();
  tableData: PartnerListResponseDTO[] = [];
  public statesOptions: { content: string; value: any; color?: any }[] = [];

  showPrizeDetailsView: boolean = false;
  showScheduleView: boolean = false;
  bonusData: PartnerBonus | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private modal: NgbModal,
    private userInfoService: UserInfoService,
    private periodCompoundService: PeriodCompoundService,
    private periodResidualService: PeriodResidualService,
    private treeService: TreeService,
    private partnerBonusApiService: PartnerBonusApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userInfo = this.userInfoService.userInfo;
  }

  ngOnInit(): void {
    if (this.router.url.includes('/my-awards')) {
      this.currentTab = 5;
    }
    this.updateChildActive();
    this.subscription.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe(() => {
          if (this.router.url.includes('/my-awards')) {
            this.currentTab = 5;
          }
          this.updateChildActive();
        })
    );

    this.loadDataCompound(this.pageCompound, this.rowsCompound);
    this.loadDataResidual(this.pageResidual, this.rowsResidual);
    this.fetchActiveRanges();
    this.fetchHistoricData();
  }

  private updateChildActive() {
    const child = this.activatedRoute.firstChild;
    this.childActive = !!(child && child.snapshot?.url?.length);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadDataCompound(page: number, rows: number): void {
    const offset = page - 1;
    this.periodCompoundService
      .getPeriodCompoundByUser(this.userInfo.id, offset, rows)
      .subscribe((result: any) => {
        this.rangeTableData = result.data;
        this.totalRecordsCompound = result.total;
      });
  }

  loadDataResidual(page: number, rows: number): void {
    const offset = page - 1;
    this.periodResidualService
      .getPeriodResidualByUser(this.userInfo.id, offset, rows)
      .subscribe((result: any) => {
        this.rangeResidualTableData = result.data;
        this.totalRecordsResidual = result.total;
      });
  }

  public onOpenRangeModal(data: any) {
    const ref = this.modal.open(ModalAccountTreeRangesDetailComponent, {
      centered: true
    });
    const modal = ref.componentInstance as ModalAccountTreeRangesDetailComponent;

    modal.data = data;
  }

  public onOpenOrganizationManagerModal(id: number) {
    const ref = this.modal.open(ModalAccountTreeOrganizationManagerComponent, {
      centered: true
    });
    const modal = ref.componentInstance as ModalAccountTreeOrganizationManagerComponent;

    modal.id = id;
  }

  onTabChange(tabIndex: number): void {
    this.currentTab = tabIndex;
    if (this.currentTab === 2) {
      this.pageCompound = 1;
      this.loadDataCompound(this.pageCompound, this.rowsCompound);
    } else if (this.currentTab === 3) {
      this.pageResidual = 1;
      this.loadDataResidual(this.pageResidual, this.rowsResidual);
    }
  }

  onPageChange(event: any): void {
    const page = event.page + 1;
    const rows = event.rows;
    if (this.currentTab === 2) {
      this.pageCompound = page;
      this.rowsCompound = rows;
      this.loadDataCompound(this.pageCompound, this.rowsCompound);
    } else if (this.currentTab === 3) {
      this.pageResidual = page;
      this.rowsResidual = rows;
      this.loadDataResidual(this.pageResidual, this.rowsResidual);
    }
  }

  onRefresh(event: any): void {
    const rows = event.rows;

    if (this.currentTab === 2) {
      this.rowsCompound = rows;
      this.loadDataCompound(1, this.rowsCompound);
    } else if (this.currentTab === 3) {
      this.rowsResidual = rows;
      this.loadDataResidual(1, this.rowsResidual);
    }
  }

  fetchHistoricData(): void {
    this.periodResidualService.getHistoricData(this.userInfo.id).subscribe({
      next: (data) => {
        this.historicData = data;
        this.filterActiveRanges();
      },
      error: (error) => {
        console.error('Error al obtener los datos históricos:', error);
      }
    });
  }

  validateImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

  fetchActiveRanges(): void {
    this.loading = true;
    this.errorMessage = '';

    this.periodResidualService.getActiveRanges().subscribe({
      next: async (data) => {
        if (data && Array.isArray(data.data)) {
          const allRanks = data.data;
          const validatedRanks = [];

          for (const rank of allRanks) {
            const imageUrl = this.getMedalImage(rank.name);
            const isValid = await this.validateImage(imageUrl);
            if (isValid) {
              validatedRanks.push(rank);
            }
          }

          this.ranks = validatedRanks;
          this.filterActiveRanges();
        } else {
          console.error('Estructura de datos inesperada:', data);
          this.ranks = [];
        }
      },
      error: (error) => {
        this.errorMessage = 'Error al obtener los rangos activos';
        console.error('Error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filterActiveRanges(): void {
    if (this.historicData && this.historicData.data) {
      const { idActualRange, idNextRange, idMaxRange, rangeCounts } = this.historicData.data;

      this.ranks = this.ranks.map(rank => {
        let status = 'No Logrado';
        let enabledText = '';
        let rangeCount = rangeCounts[rank.idRange] || 0;

        if (rank.idRange < idActualRange) {
          status = 'Logrado';
          enabledText = 'Rango Anterior';
        } else if (rank.idRange === idActualRange) {
          status = 'Logrado';
          enabledText = 'Rango Actual';
        } else if (rank.idRange === idNextRange) {
          status = 'No Logrado';
          enabledText = 'Siguiente Rango';
        } else if (rank.idRange === idMaxRange) {
          status = 'No Logrado';
          enabledText = 'Máximo Rango';
        }

        return {
          ...rank,
          buttonDisabled: !(rank.idRange === idActualRange || rank.idRange === idNextRange || rank.idRange === idMaxRange),
          enabledText: enabledText,
          status: status,
          rangeCount: rangeCount
        };
      });
    }
  }

  getMedalImage(name: string): string {
        return getMedalImage(name);
  }

  showPrizeDetails() {
    this.loading = true;
    this.subscription.add(
      this.partnerBonusApiService.fetchGetByFullName(this.userInfo.headerName).subscribe({
        next: (response: IResponseData<PartnerBonus[]>) => {
          this.bonusData = response.data && response.data.length > 0 ? response.data[0] : null;
          this.showPrizeDetailsView = true;
          this.showScheduleView = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching bonus data:', error);
          this.errorMessage = 'Error al obtener los datos del bono';
          this.loading = false;
        }
      })
    );
  }

  showSchedule() {
    this.showPrizeDetailsView = false;
    this.showScheduleView = true;
  }

  hideSchedule() {
    this.showPrizeDetailsView = true;
    this.showScheduleView = false;
  }

  goBack() {
    this.showPrizeDetailsView = false;
    this.showScheduleView = false;
    this.bonusData = null;
  }
}
