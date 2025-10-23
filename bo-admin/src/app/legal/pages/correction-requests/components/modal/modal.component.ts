import { Component, OnInit } from '@angular/core';
import { ModalService, ModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],

})
export class ModalComponent implements OnInit {
  showModal = false;
  currentModal: ModalConfig | null = null;
  recipientName = '';
  message = '';
  documentUrl: string = '';

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.modalService.modal$.subscribe(config => {
      this.currentModal = config;
      this.showModal = true;

      if (config.type === 'preview') {
        this.documentUrl = config.data.url;
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.currentModal = null;
    this.recipientName = '';
    this.message = '';
  }

  confirm() {
    if (this.currentModal?.type === 'confirm' && this.currentModal.data) {
      // Aquí puedes emitir un evento o llamar a un servicio con los datos
      console.log('Confirmado:', {
        ...this.currentModal.data,
        recipientName: this.recipientName,
        message: this.message
      });
    }
    this.closeModal();
  }
}