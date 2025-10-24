import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-items-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-items-list.component.html',
  styleUrl: './action-items-list.component.scss'
})
export class ActionItemsListComponent {
  @Input() items: { label: string; isLink: boolean }[] = [];
/*   @Output() arrowClicked = new EventEmitter<any>();
 */

 @Output() arrowClicked = new EventEmitter<{ item: any }>();
 


}
