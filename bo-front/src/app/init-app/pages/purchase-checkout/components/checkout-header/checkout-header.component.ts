import { Component, EventEmitter, HostListener, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { PublicAuthService } from '../../../public-access/auth/services/public-auth.service';
import { AuthService } from '../../../../../authentication/commons/services/services-auth/auth.service';
import { PendingPurchaseService } from '../../../../../shared/services/pending-purchase.service';
import { CheckoutService } from '../../services/checkout.services';

@Component({
  selector: 'app-checkout-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout-header.component.html',
  styleUrl: './checkout-header.component.scss'
})
export class CheckoutHeaderComponent implements OnInit {
  @Output() logout = new EventEmitter<void>();

  userName = '';
  userDoc: string | null = '';
  showMenu = false;
  isGuest = false;
  isMember = false;

  constructor(
    private publicAuth: PublicAuthService,
    private memberAuth: AuthService,
    private cookieService: CookieService,
    private pending: PendingPurchaseService,
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    // 1) El payload del checkout manda: es la fuente de verdad
    const payload = this.pending.get<any>();
    const flowType: 'guest' | 'member' | undefined = payload?.user?.type;

    if (flowType === 'guest') {
      this.bootstrapGuest(payload?.user?.id);
      return;
    }
    if (flowType === 'member') {
      this.bootstrapMember();
      return;
    }

    // 2) Fallback si no hay payload (carga directa de la ruta)
    const guestToken = localStorage.getItem('guestToken');
    const hasAuthCookie = !!this.cookieService.get('authData');

    // Prefiere guest si hay token de guest
    if (guestToken) {
      const guestId = this.publicAuth.getGuestId();
      this.bootstrapGuest(guestId);
      return;
    }

    if (hasAuthCookie) {
      this.bootstrapMember();
      return;
    }

    // 3) Último recurso: tratar como guest con defaults
    this.isGuest = true;
    this.isMember = false;
    this.userName = 'Invitado';
    this.userDoc = null;
  }

  /** Inicializa encabezado para invitado. Ignora cualquier cookie del socio. */
  private bootstrapGuest(explicitGuestId?: number | string | null): void {
    this.isGuest = true;
    this.isMember = false;

    // Defaults visibles inmediatamente
    this.userName = 'Invitado';
    this.userDoc = null;

    const guestId = explicitGuestId ?? this.publicAuth.getGuestId();
    if (guestId == null) return;

    // Carga de datos reales del invitado desde TicketApi
    this.checkoutService.getPublicUserInfo(guestId).subscribe({
      next: (info) => {
        if (info?.fullName) this.userName = info.fullName;
        if (info?.documentNumber) this.userDoc = info.documentNumber;
      },
      error: () => {
        // Silencioso: mantenemos 'Invitado' y sin doc
      }
    });
  }

  /** Inicializa encabezado para socio. Solo aquí se consulta el gateway. */
  private bootstrapMember(): void {
    this.isMember = true;
    this.isGuest = false;

    // Si no hay cookie válida, no llames gateway
    const raw = this.cookieService.get('authData');
    if (!raw) return;

    let auth: any;
    try {
      auth = JSON.parse(raw);
    } catch {
      return;
    }
    const username: string | undefined = auth?.username ?? auth?.userName;
    if (!username) return;

    // Llamada al gateway (aquí sí procede)
    this.memberAuth.getUser(username).subscribe({
      next: (res: any) => {
        const data = res?.data || {};
        const first = data?.name || '';
        const last = data?.lastName || '';
        const fullName = `${first} ${last}`.trim();
        if (fullName) this.userName = fullName;
        this.userDoc = username;
      },
      error: () => {
        // Degrada UI pero no rompe
        this.userName = this.userName || 'Socio';
        this.userDoc = username;
      }
    });
  }

  get initials(): string {
    return this.userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0]?.toUpperCase() || '')
      .join('');
  }

  toggleMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  onLogoutClick(): void {
    // Limpiar compra pendiente sin importar el tipo
    try { this.pending.clear(); } catch {}

    const guestToken = localStorage.getItem('guestToken');
    const authData = this.cookieService.get('authData');

    if (guestToken) {
      this.publicAuth.logout();      // limpia guestToken y navega a /home
    } else if (authData) {
      this.memberAuth.logout().subscribe({
        next: () => {
          this.cookieService.deleteAll();
          this.router.navigate(['/home']);
        },
        error: () => {
          this.cookieService.deleteAll();
          this.router.navigate(['/home']);
        }
      });
    } else {
      this.router.navigate(['/home']);
    }

    this.logout.emit();
    this.showMenu = false;
  }

  @HostListener('document:click')
  onDocClick(): void {
    this.showMenu = false;
  }
}
