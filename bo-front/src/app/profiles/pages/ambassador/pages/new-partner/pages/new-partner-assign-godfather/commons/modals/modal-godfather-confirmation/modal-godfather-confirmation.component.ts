import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

interface GodfatherConfirmationData {
  godfatherName: string;
  godfatherUsername: string;
  level: number;
  isInLine: boolean;
}

@Component({
  selector: 'app-modal-godfather-confirmation',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './modal-godfather-confirmation.component.html'
})
export class ModalGodfatherConfirmationComponent implements OnInit {
  
  godfatherData: GodfatherConfirmationData;
  commissionMessage: string = '';
  commissionDetails: string[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.godfatherData = this.config.data;
    console.log('📋 Datos recibidos en modal de confirmación:', this.godfatherData);
  }

  ngOnInit(): void {
    this.setupCommissionMessage();
  }

  private setupCommissionMessage(): void {
    const { level, isInLine } = this.godfatherData;

    if (isInLine) {
      if (level === 15) {
        // Caso: Padrino en nivel 15
        this.commissionMessage = 'El padrino está en el nivel 15 (último nivel)';
        this.commissionDetails = [
          'Solo el padrino recibirá comisión en nivel 2',
          'No tiene ascendentes, por lo que nadie más comisionará'
        ];
      } else if (level >= 1 && level <= 14) {
        // Caso: Padrino en línea ascendente (niveles 1-14)
        this.commissionMessage = `El padrino está en tu línea ascendente (Nivel ${level})`;
        this.commissionDetails = [
          'El padrino recibirá comisión en nivel 2 (después del patrocinador directo)',
          `Los niveles inferiores al padrino (niveles 1 a ${level - 1}) NO comisionarán`,
          `Los niveles superiores al padrino (niveles ${level + 1} en adelante) sí comisionarán`
        ];
      }
    } else {
      // Caso: Padrino fuera de línea ascendente
      this.commissionMessage = 'El padrino NO está en tu línea ascendente';
      this.commissionDetails = [
        'Solo el padrino recibirá comisión',
        'Los 14 niveles de tu línea ascendente NO recibirán comisión',
        'El patrocinador directo tampoco recibirá comisión'
      ];
    }
  }

  onConfirm(): void {
    this.ref.close(true);
  }

  onCancel(): void {
    this.ref.close(false);
  }
}

