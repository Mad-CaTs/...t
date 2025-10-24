import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'card-communicated',
  templateUrl: 'card-communicated.component.html',
  styleUrls: ['./card-communicated.component.css'],
  standalone: true,
  imports: [MatButtonModule, RouterLink,MatCardModule,CommonModule],
})
export default class CardCommunicatedComponent {

  @Input() image: string = '';   
  @Input() title: string = '';   
  @Input() date: string = '';
  @Input() eventType: string = ''; 
  @Output() clickDetail = new EventEmitter<void>(); 
  @Input() horizontal: boolean = false;
  @Input() description: string = '';
  @Input() noMoreButton: boolean = false; 
  onClick() {
    this.clickDetail.emit(); 
  }
/*   @Output() clickDetail = new EventEmitter<boolean>();

  onClickDetail = () => this.clickDetail.emit(true); */
}
