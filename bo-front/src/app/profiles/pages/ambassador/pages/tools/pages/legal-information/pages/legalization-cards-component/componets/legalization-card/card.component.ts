import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  imports: [CardModule,MatIconModule,CommonModule],
})
export default  class CardLegalizacionComponent {
  @Input() width: string = '';
  @Input() headerIcon: string = '';
  @Input() title: string = '';
  @Input() content: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClickButton() {
    this.buttonClick.emit();
  }

}
