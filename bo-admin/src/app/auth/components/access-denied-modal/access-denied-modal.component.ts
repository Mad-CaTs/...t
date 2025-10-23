import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-access-denied-modal',
  templateUrl: './access-denied-modal.component.html',
  styleUrls: ['./access-denied-modal.component.scss'], 
})
export class AccessDeniedModalComponent implements OnInit {
  isModalVisible = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.showModal$.subscribe((isVisible) => {
      this.isModalVisible = isVisible;
    });
  }

  closeModal(): void {
    this.modalService.closeModal();
  }
}
