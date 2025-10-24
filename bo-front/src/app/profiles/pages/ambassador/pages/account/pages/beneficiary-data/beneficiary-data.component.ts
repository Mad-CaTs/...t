import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { BeneficiaryTableComponent } from './commons/beneficiary-table/beneficiary-table.component';
import { BeneficiaryService } from './services/beneficiary-service.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-beneficiary-data',
  standalone: true,
  imports: [CommonModule, BeneficiaryTableComponent],
  templateUrl: './beneficiary-data.component.html',
  styleUrl: './beneficiary-data.component.scss'
})
export class BeneficiaryDataComponent {
  totalRecords: number = 0;
  beneficiaries: any[] = [];
  userInfo: any;
  preselectSid: number | null = null;

  constructor(private beneficiaryService: BeneficiaryService, private userInfoService: UserInfoService
    , private cdr: ChangeDetectorRef, private route: ActivatedRoute
  ) {
    this.userInfo = this.userInfoService.userInfo;
  }

  ngOnInit(): void {
    // this.loadData(1, 10);
    const sidParam = this.route.snapshot.queryParamMap.get('sid');
    this.preselectSid = sidParam ? +sidParam : null;
  }


  loadData(page: number, rows: number): void {
    const offset = (page - 1) * rows;
    this.beneficiaryService.getBeneficiariesByUserId(this.userInfo.id, offset, rows).subscribe((result: any) => {
      this.beneficiaries = result.data.map((beneficiary: any) => {
        return {
          ...beneficiary,
          gender: this.mapGender(beneficiary.gender),
        };
      });
      this.totalRecords = result.total;
    });
  }

  private mapGender(gender: string): string {
    switch (gender) {
      case '1':
        return 'Masculino';
      case '2':
        return 'Femenino';
      default:
        return 'No especificado';
    }
  }


  onPageChange(event: any): void {
    const page = event.page + 1;
    const rows = event.rows;
    this.loadData(page, rows);
  }

  onRefresh(event: any): void {
    const rows = event.rows || 10;
    this.loadData(1, rows);
  }

}
