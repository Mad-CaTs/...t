import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modals-solicitud-retiro',
  templateUrl: './modals-solicitud-retiro.component.html',
  styleUrls: ['./modals-solicitud-retiro.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ModalsSolicitudRetiroComponent {
  loading = true;
  @Input() icon: string;
  @Input() title: string;
  @Input() modo: string;
  @Input() subtitle: string;
  @Input() data: string;
  constructor(
    public instanceModal: NgbActiveModal,
  ) { }
  ngOnInit() {
    this.loading = false
  }
  
  volver() {
    this.instanceModal.close({ success: false })
  }

  confirmar() {
    if (this.modo == 'confirmar') {
      this.instanceModal.close({ success: true, data: true })

    }
    else {
      this.instanceModal.close({ success: true, data: false })
    }
  }
}
