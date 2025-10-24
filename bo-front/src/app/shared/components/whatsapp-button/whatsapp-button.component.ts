import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent {
  @Input() phoneNumber: string = '';
  @Input() message: string = '';

  get whatsappUrl(): string {
    const base = 'https://wa.me/';
    const encodedMessage = encodeURIComponent(this.message);
    return `${base}${this.phoneNumber}?text=${encodedMessage}`;
  }
}