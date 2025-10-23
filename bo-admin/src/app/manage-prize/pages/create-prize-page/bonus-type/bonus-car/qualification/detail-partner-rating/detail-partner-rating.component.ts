import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-partner-rating',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detail-partner-rating.component.html',
  styleUrls: ['./detail-partner-rating.component.scss']
})
export class DetailPartnerRatingComponent {

  form = new FormGroup({
    fullName: new FormControl('Karem Monica Saucedo Echevarría'),
    usuario: new FormControl('KA2341'),
    dni: new FormControl('43372145'),
    rango: new FormControl('Esmeralda'),
    pais: new FormControl('Perú'),
    puntosAlcanzados: new FormControl(13580),
    puntosMeta: new FormControl(13500),
    ciclosRecalificados: new FormControl(5),
    fechaCierre: new FormControl('2025-04-20')
  });

  // PDF
  pdfUrl: SafeResourceUrl | null = null;

  private fromPage: 'prequalified' | 'qualified' = 'prequalified';

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
    const url = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf';
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // read query param 'from' if present
    const qp = this.route.snapshot.queryParamMap.get('from');
    if (qp === 'qualified') this.fromPage = 'qualified';
  }

  // Valida si cumplió meta de puntos
  get achievedOk(): boolean {
    const a = Number(this.form.value.puntosAlcanzados ?? 0);
    const m = Number(this.form.value.puntosMeta ?? 0);
    return a >= m;
  }

  // Mock de acciones
  onBack(): void {
    if (this.fromPage === 'qualified') {
      this.router.navigateByUrl('/dashboard/manage-prize/bonus-type/car/qualification/qualified');
      return;
    }
    this.router.navigateByUrl('/dashboard/manage-prize/bonus-type/car/qualification/prequalified');
  }

  onSave(): void {
    alert('Guardar (MOCK)');
  }
}
