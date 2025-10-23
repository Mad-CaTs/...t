import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';

import { CommonTableComponent } from './common-table/common-table.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
	declarations: [CommonTableComponent, PaginationComponent],
	imports: [CommonModule, InlineSVGModule, ReactiveFormsModule],
	exports: [CommonTableComponent, PaginationComponent]
})
export class TablesModule { }
