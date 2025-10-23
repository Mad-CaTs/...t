import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type BonusCard = {
  title: string;
  description: string;
  icon: string;
  path?: string;
  disabled?: boolean;
};

@Component({
  selector: 'app-bonus-car',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bonus-car.component.html',
  styleUrls: ['./bonus-car.component.scss']
})
export class BonusCarComponent {
  public readonly cards: BonusCard[] = [
    {
      title: 'Creación de Autos',
      description: 'Documenta la incorporación de vehículos al programa.',
      path: '/dashboard/manage-prize/bonus-type/car/car-creation',
      icon: 'bi-truck-front'
    },
    {
      title: 'Asignación de Autos',
      description: 'Administra la entrega de autos a socios calificados.',
      path: '/dashboard/manage-prize/bonus-type/car/car-assignment',
      icon: 'bi-plus-lg'
    },
    {
      title: 'Asignación de Bonos',
      description: 'Controla la entrega de bonos por desempeño.',
      path: '/dashboard/manage-prize/bonus-type/car/bonus-assignment',
      icon: 'bi-box-seam'
    },
    {
      title: 'Pagos de Bono',
      description: 'Controla y administra el pago de Bonos auto.',
      path: '/dashboard/manage-prize/bonus-type/car/bonus-payments',
      icon: 'bi-coin'
    },
    {
      title: 'Precalificados / Calificados',
      description: 'Administra la lista de socios precalificados y calificados.',
      path: '/dashboard/manage-prize/bonus-type/car/qualification',
      icon: 'bi-person-check'
    },
    {
      title: 'Proformas',
      description: 'Administra las proformas enviadas por los socios.',
      path: '/dashboard/manage-prize/bonus-type/car/proformas',
      icon: 'bi-receipt'
    },
    {
      title: 'Documentos',
      description: 'Administra los documentos oficiales del premio.',
      path: '/dashboard/manage-prize/bonus-type/car/documents',
      icon: 'bi-file-earmark-text'
    }
  ];

  trackByIndex = (i: number) => i;
}