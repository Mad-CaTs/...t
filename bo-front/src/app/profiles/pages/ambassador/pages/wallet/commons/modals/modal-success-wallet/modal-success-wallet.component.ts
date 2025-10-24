import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-success-wallet',
  standalone: true,
  imports: [CommonModule, MatIconModule, DialogModule],
  templateUrl: './modal-success-wallet.component.html',
  styleUrl: './modal-success-wallet.component.scss'
})
export class ModalSuccessWalletComponent {
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }
  name: string = ""
  lastName: string = ""
  username: string = ""
  monto: any
  initialDate
  ngOnInit() {
    let { name, lastName, username, monto, initialDate } = this.config.data
    this.name = name
    this.lastName = lastName
    this.username = username
    this.monto = monto
    console.log(initialDate);

    this.initialDate = this.transformDate(initialDate)
  }
  transformDate(dateString: string): string {
    const date = new Date(dateString);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';

    return `${dayName} ${day} ${month} ${year} - ${hours}:${minutes} ${ampm}.`;
  }
  closeModal() {
    this.ref.close();
  }
  get data() {
    const icon = this.config.data?.icon;
    if (!this.isImage(icon)) {
      this.config.data.icon = 'assets/icons/Inclub.png';
    }
    return this.config.data;
  }
  isImage(icon: string): boolean {
    return icon.includes('.png') || icon.includes('.jpg') || icon.includes('.jpeg');
  }

}
