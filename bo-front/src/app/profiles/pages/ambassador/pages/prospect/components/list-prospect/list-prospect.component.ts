import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { TableProspectComponent } from '../table-prospect/table-prospect.component';
import { CommonModule } from '@angular/common';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ProspectService } from '../../services/prospect-service.service';

@Component({
  selector: 'app-list-prospect',
  standalone: true,
  imports: [CommonModule, TableProspectComponent],
  templateUrl: './list-prospect.component.html',
  styleUrl: './list-prospect.component.scss'
})
export class ListProspectComponent {
  @Input() activeTab: number = 1;
  totalRecords: number = 0;
  prospects: any[] = [];
  userInfo: any;

  constructor(private prospectService: ProspectService, private userInfoService: UserInfoService
    , private cdr: ChangeDetectorRef
  ) {
    this.userInfo = this.userInfoService.userInfo;
  }

  ngOnInit(): void {
    this.loadData(1, 10);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeTab'] && changes['activeTab'].currentValue === 2) {
      this.loadData(1, 10);
    }
  }

  loadData(page: number, rows: number): void {
    const offset = (page - 1);
    this.prospectService.getProspectsByUserId(this.userInfo.id, offset, rows).subscribe((result: any) => {
      this.prospects = [];
      this.prospects = result.data.map((prospect: any) => {
        return {
          ...prospect,
          gender: this.mapGender(prospect.gender),
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
    const rows = event.rows;
    this.loadData(1, rows);
  }

}
