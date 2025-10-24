import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-button',
  standalone: true,
  imports: [],
  templateUrl: './chat-button.component.html',
  styleUrl: './chat-button.component.scss'
})
export class ChatButtonComponent {

  @Output() chatOpened = new EventEmitter<void>(); // Evento para abrir el chat

  openChat() {
    this.chatOpened.emit(); // Emitir evento al hacer clic
  }


}
