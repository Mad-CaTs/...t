import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.scss'
})
export class ChatCardComponent {
  @Input() iconSrc!: string; 
  @Input() title!: string; 
  @Input() description!: string; 
  @Input() buttonText!: string; 
  @Output() buttonClick = new EventEmitter<void>(); // Emitir evento al hacer clic

  onButtonClick() {
    this.buttonClick.emit(); // Emitimos el evento cuando el usuario haga clic
  }
  
 
}
