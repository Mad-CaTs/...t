import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DragScrollDirective } from '@shared/directives/mouse-event/drag-scroll.directive';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule, DragScrollDirective],
})
export class TableComponent {
  @Input() headers: string[];
  @Input() firstEmpty: boolean = false;
  @Input() hasCheckbox: boolean = true;
  @Input() customRows: boolean = false;
  @Input() minWidth: number = 1200;
  @Input() minWidthHeader: number[] = [];
  @Input() loading: boolean = false;
  @Input() hasData: boolean = false;
  @Input() scrollable: boolean = false;
  @Input() showFooter: boolean = true; 

}
