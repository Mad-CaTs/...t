import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-modal-alert',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './modal-alert.component.html',
	styleUrl: './modal-alert.component.scss',
	providers: [DialogService],
})
export class ModalAlertComponent {
	header: string;
	message: string;
	constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }
	closeModal() {
		this.ref.close();
	}

	get data() {
		return this.config.data;
	}

getIconColor(icon: string): string {
  if (icon === 'pi pi-exclamation-triangle'|| icon === 'pi pi-lock') {
    return '#F0692C'; 
  } 
  else if (icon === 'pi pi-times-circle') {
    return 'red'; 
  }
 
  return 'black'; 
}

}
