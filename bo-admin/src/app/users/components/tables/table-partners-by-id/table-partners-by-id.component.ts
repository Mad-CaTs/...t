import { Component, EventEmitter, Input, Output } from '@angular/core';

type RowVM = {
  idUser: number;
  num: number;
  userName: string;
  fullName: string;
  status: string;
  colorRGB: string,
  rangeName: string;
  sponsorName: string;
  sponsorshipLevel: number | string;
  branchName: string;
  createdAt: string;
  sponsorLevel: number;
};

@Component({
  selector: 'app-table-partners-by-id',
  templateUrl: './table-partners-by-id.component.html',
  styleUrls: ['./table-partners-by-id.component.scss']
})
export class TablePartnersByIdComponent {

  @Input() dataBody: RowVM[] = [];
  @Input() pageIndex = 1; 
  @Input() pageSize = 10;
  @Input() length = 0;

  @Output() detail = new EventEmitter<RowVM>();
  @Output() paginate = new EventEmitter<{page: number, size: number}>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  trackRow = (_: number, r: RowVM) => r.userName ?? r.fullName ?? _;

  getTransparentColor(color: string): string{
    return this.hexToRgba(color, 0.4,1);
  }

  getSolidColor(color: string): string{
    return this.hexToRgba(color, 1, 0.8);
  }

  private hexToRgba(hex: string, opacity: number, factor: number): string {
		const bigint = parseInt(hex.replace('#', ''), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;

		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

  viewByPartner(row: RowVM){
    this.detail.emit(row);
  }

  onPaginate(e:  {page: number; size: number;}){
    this.paginate.emit(e);
  }

  onUiPageChange(newPage: number) {
    this.pageChange.emit(newPage);
  }

  onUiPageSizeChange(newSize: number) {
    this.pageSizeChange.emit(newSize);
  }

  onPageChange(newPage: number){
    this.pageIndex = newPage;
    this.pageChange.emit(newPage);
  }

  onPageSizeChange(newSize: number){
    this.pageSize = newSize;
    this.pageIndex = 1;
    this.pageSizeChange.emit(newSize);
  }

  
}
