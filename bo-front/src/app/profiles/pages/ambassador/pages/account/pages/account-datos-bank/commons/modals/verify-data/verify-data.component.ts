import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-verify-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-data.component.html',
  styleUrl: './verify-data.component.scss',
  providers: [DialogService],

})
export class VerifyDataComponent {
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) { }
  datos: any
  ngOnInit(): void {
    this.datos = this.config.data;
  }
  closeModal() {
    this.ref.close();
  }
  next() {
    this.ref.close(true);
  }
}
