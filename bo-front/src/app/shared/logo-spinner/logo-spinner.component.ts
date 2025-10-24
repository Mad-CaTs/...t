//src/app/shared/logo-spinner/logo-spinner.component.ts
/**
 * Spinner animado reutilizable basado en el logotipo de la aplicación.
 *
 * Ofrece dos modos principales:
 *
 * 1. **Inline** — Se incrusta en cualquier contenedor y hereda su flujo.
 * 2. **Pantalla completa** — Cubre toda la vista y bloquea el scroll mientras se muestra.
 *    En modo fullscreen el CSS agrega:
 *        • Halo pulsante suave (::after)
 *        • Anillo exterior giratorio (::before)
 *
 * ### Ejemplo inline (20 px)
 * ```html
 * <app-logo-spinner
 *   [show]="isLoading"
 *   size="20px">
 * </app-logo-spinner>
 * ```
 *
 * ### Ejemplo pantalla completa
 * ```html
 * <app-logo-spinner
 *   [show]="isSubmitting"
 *   [fullscreen]="true"
 *   [delay]="200"
 *   [minVisible]="600">
 * </app-logo-spinner>
 * ```
 *
 * @remarks
 * - Usa `::ng-deep` para animar elementos internos del SVG; si duplicas el
 *   logo mantén las clases `.left` y `.right` para conservar la animación.
 * - El SVG se carga por HTTP la primera vez que se instancia; posteriores usos
 *   lo reutilizarán desde memoria.
 * - `delay` retrasa el inicio y `minVisible` garantiza un tiempo mínimo visible.
 *
 * @inputs
 * | Propiedad      | Tipo                  | Default | Descripción                                                  |
 * |----------------|-----------------------|---------|--------------------------------------------------------------|
 * | `show`         | `boolean` *required*  | —       | Muestra (`true`) u oculta (`false`) el spinner.              |
 * | `delay`        | `number`              | `100`   | Retraso (ms) antes de aparecer para evitar parpadeos.        |
 * | `minVisible`   | `number`              | `400`   | Tiempo mínimo visible (ms) antes de poder ocultarse.         |
 * | `fullscreen`   | `boolean`             | `false` | Si `true`, bloquea la pantalla y añade halo + anillo.        |
 * | `size`         | `string`              | `'28px'`| Ancho/alto en modo inline (ej. `'32px'`, `'2rem'`).          |
 */
import { Component, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-logo-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-spinner.component.html',
  styleUrls: ['./logo-spinner.component.scss']
})
export class LogoSpinnerComponent implements OnInit, OnDestroy {
  /** Activa o desactiva el spinner */
  @Input({ required: true }) set show(value: boolean) {
    value ? this.startDelay() : this.hide();
  }

  /** Retraso antes de mostrarse (ms) */
  @Input() delay = 100;

  /** Tiempo mínimo visible (ms) */
  @Input() minVisible = 400;

  /** Modo pantalla completa */
  @Input() fullscreen = false;

  /** Tamaño inline (no aplica en fullscreen) */
  @Input() size = '28px';

  svgContent!: SafeHtml;
  visible = false;

  private shownAt = 0;
  private delaySub?: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.http
      .get('assets/images/logo-spinner/logo-spinner.svg', { responseType: 'text' })
      .subscribe(svg => (this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg)));
  }

  ngOnDestroy(): void {

    if (this.delaySub) {
      this.delaySub.unsubscribe();
      this.delaySub = undefined;
    }
    this.visible = false;
    try { this.document.body.style.overflow = ''; } catch {}
  }

  /** Arranca el timer de `delay` y luego muestra el spinner */
  private startDelay(): void {
    if (this.delaySub) return;

    this.delaySub = timer(this.delay).subscribe(() => {
      this.visible = true;
      this.shownAt = performance.now();
      this.delaySub = undefined;

      if (this.fullscreen) {
        this.document.body.style.overflow = 'hidden';
      }
    });
  }

  /** Oculta el spinner respetando `minVisible` */
  private hide(): void {
    if (this.delaySub) {
      this.delaySub.unsubscribe();
      this.delaySub = undefined;
    }

    const elapsed = performance.now() - this.shownAt;
    const remaining = this.minVisible - elapsed;

    timer(Math.max(remaining, 0)).subscribe(() => {
      this.visible = false;
      if (this.fullscreen) {
        this.document.body.style.overflow = '';
      }
    });
  }
}
