//src/app/init-app/pages/public-access/login-selection/login-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginTestimonialComponent } from '../shared/login-testimonial/login-testimonial.component';
import { PendingPurchaseService } from '@shared/services/pending-purchase.service';

@Component({
  selector: 'app-login-selection',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginTestimonialComponent],
  templateUrl: './login-selection.component.html',
  styleUrl: './login-selection.component.scss'
})
export class LoginSelectionComponent implements OnInit {
  constructor(
    private router: Router,
    private pending: PendingPurchaseService
  ) {}

  ngOnInit(): void {
    const data = this.pending.get();
    if (data) {
      //console.log('[PendingPurchase] Detectado en login-selection:', data);
    } else {
      //console.log('[PendingPurchase] No hay datos en login-selection (flujo normal).');
    }
  }

  goSocio(): void {
    const data = this.pending.get();
    if (data) {
      this.pending.set(data);
      //console.log('[PendingPurchase] Re-guardado al elegir Socio (a):', data);
    } else {
      //console.log('[PendingPurchase] Sin datos al elegir Socio (a) (flujo normal).');
    }
  // Propagar intención de volver a checkout tras login de socio
  this.router.navigate(['/login-nuevo'], { queryParams: { returnUrl: '/checkout' } });
  }

  goPublic(): void {
    const data = this.pending.get();
    if (data) {
      this.pending.set(data);
      //console.log('[PendingPurchase] Re-guardado al elegir Público en general:', data);
    } else {
      //console.log('[PendingPurchase] Sin datos al elegir Público en general (flujo normal).');
    }
  // Opcional: propagar returnUrl para futuros usos
  this.router.navigate(['/login-public'], { queryParams: { returnUrl: '/checkout' } });
  }
}
