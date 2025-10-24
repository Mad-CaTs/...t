import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-chatbot',
  standalone: true,
  imports: [CommonModule,DialogModule,MatIconModule,FormsModule],
  templateUrl: './modal-chatbot.component.html',
  styleUrl: './modal-chatbot.component.scss'
})
export class ModalChatbotComponent {
  currentTime: string = '';
  assistantOptions: string[] = [];
  userMessages: string[] = [];
  assistantResponse: string | null = null;
  loadingResponse: boolean = false;
  selectedOption: string | null = null;
  messages: { sender: string, text: string, time: string }[] = [];  // Lista de todos los mensajes


  constructor(public ref: DynamicDialogRef, private router:Router) {}
 /*  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000); 
  }
 */

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);

  
  }

  isVisible: boolean = false;
  userResponse: string = '';
  loading: boolean = false;
  message: string = '';

  addMessage(sender: string, text: string) {
    const newMessage = {
      sender: sender,    // 'assistant' o 'user'
      text: text,
      time: new Date().toLocaleTimeString()  // Hora del mensaje
    };
    this.messages.push(newMessage); // Agregar el mensaje al array de mensajes
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.loadingResponse = true;
    this.assistantResponse = null;
    this.assistantOptions = [];
  
    this.addMessage('user', option);

    // Simula el tiempo de carga con el loader
    setTimeout(() => {
      this.loadingResponse = false;
  
      if (option === 'Asistente legal') {
        this.assistantResponse = "Por favor, elige la opción que más se acerque a tu consulta:";
        this.assistantOptions = [
          "A)  Deseo legalizar un contrato",
          "B)  Deseo legalizar un certificado",
          "C)  Deseo legalizar un contrato y certificado",
          "D)  Deseo conocer el status de mi legalización",
          "E)  Otras consultas"
        ];
      } else if (option === 'Soporte de Inclub') {
        this.assistantResponse = "Por favor, elige el tipo de soporte que necesitas:";
        this.assistantOptions = [
          "A)  Problemas de acceso",
          "B)  Errores en la plataforma",
          "C)  Asesoría sobre el servicio",
          "D)  Facturación y pagos",
          "E)  Otro tipo de consulta"
        ];
      }
      this.addMessage('assistant', this.assistantResponse);  // Mostrar la respuesta inicial del asistente

    }, 2000);
  }
 
  

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }


  
  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  sendMessage() {
    if (this.message.trim()) {
      this.addMessage('user', this.message);  // Añadir mensaje del usuario
      this.message = '';  // Limpiar el campo de entrada del mensaje
  
      // Simula la respuesta del asistente
      this.loadingResponse = true;
      setTimeout(() => {
        this.loadingResponse = false;
        const assistantText = "Gracias por tu mensaje, te ayudaré pronto.";
        this.addMessage('assistant', assistantText);  // Añadir la respuesta del asistente
        this.assistantResponse = assistantText;
      }, 2000);
    }
  }

 /*  sendMessage() {
    if (this.message.trim() !== "") {
      this.userMessages.push(this.message);
      this.message = "";
      setTimeout(() => {
        this.assistantResponse = "Estoy procesando tu solicitud...";
      }, 1000);
    } */

 /*  sendMessage() {
    if (this.message.trim() === '') return;
    
    this.userResponse = this.message;
    this.message = '';
    
    setTimeout(() => {
        this.assistantResponse = 'Gracias por tu mensaje. ¿En qué más puedo ayudarte?';
    }, 1000);
} */
  



    captureUserSelection(option: string) {
      this.loadingResponse = true;
      this.assistantOptions = [];
  
      setTimeout(() => {
        this.loadingResponse = false;
        this.assistantResponse = `Has seleccionado: ${option}`;
      }, 2000);
    }
  

}