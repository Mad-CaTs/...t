import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PROFORMA_DOCUMENT_MOCK, ProformaDocument } from './proforma.mock';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';

@Component({
  selector: 'app-proforma-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalNotifyComponent],
  templateUrl: './proforma-document.component.html',
  styleUrls: ['./proforma-document.component.scss'],
})
export class ProformaDocumentComponent implements OnDestroy {

  pdfSafeUrl: SafeResourceUrl | null = null;
  pdfName = '';
  private objectUrl?: string;

  maxSizeMB = 10;
  dragOver = false;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  eventos = ['EMCUMBRA ELEVATE OCTUBRE 2025', 'LANZAMIENTO Q1 2026', 'BLACK WEEK 2025'];
  cuotasOpts = [1, 2, 3, 4, 5, 6];
  countries = [
    { iso: 'PE', name: 'Perú', dial: '+51', flag: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/Countries/pe.svg' },
    { iso: 'AR', name: 'Argentina', dial: '+54', flag: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/Countries/ar.svg' },
    { iso: 'MX', name: 'México', dial: '+52', flag: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/Countries/mx.svg' },
  ];
  countryMenuOpen = false;

  form = new FormGroup({
    marca: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    modelo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    color: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    precioUSD: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0.01)] }),
    concesionaria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    ejecutivoVentas: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    telefonoPais: new FormControl('+51', { nonNullable: true }),
    telefono: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d[\d\s]{6,}$/)] }),
    file: new FormControl<File | null>(null),
    evento: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cuotasInicial: new FormControl(2, { nonNullable: true, validators: [Validators.min(1)] }),
    inicialTotal: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
    bonoEmpresa: new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
  });

  mode: 'create' | 'edit' = 'create';
  proformaId: number | null = null;
  documentId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {
    const pId = this.route.snapshot.paramMap.get('proformaId');
    const dId = this.route.snapshot.paramMap.get('documentId');
    this.proformaId = pId ? +pId : null;
    this.documentId = dId ? +dId : null;
    this.mode = this.documentId ? 'edit' : 'create';

    if (this.mode === 'edit' && this.documentId) {
      const d = PROFORMA_DOCUMENT_MOCK.find(x => x.id === this.documentId);
      if (d) this.patchFromMock(d);
    }
  }

  isInvalid(n: string) { const c = this.form.get(n); return !!(c && c.touched && c.invalid); }
  errorText(n: string) {
    const m: Record<string, string> = {
      marca: 'La marca es obligatoria.',
      modelo: 'El modelo es obligatorio.',
      color: 'El color es obligatorio.',
      precioUSD: 'El precio es obligatorio.',
      concesionaria: 'La concesionaria es obligatoria.',
      ejecutivoVentas: 'El ejecutivo de ventas es obligatorio.',
      telefono: 'El celular del ejecutivo es obligatorio.',
      evento: 'El evento es obligatorio.',
      descripcion: 'La descripción es obligatoria.',
    };
    return m[n] || 'Este campo es obligatorio.';
  }

  get totalAPagar(): number {
    const it = Number(this.form.value.inicialTotal || 0);
    const be = Number(this.form.value.bonoEmpresa || 0);
    return Math.max(0, it - be);
  }
  get valorCuota(): number {
    const n = this.form.value.cuotasInicial || 1;
    return this.totalAPagar / n;
  }

  private patchFromMock(d: ProformaDocument) {
    this.form.patchValue({
      marca: d.marca, modelo: d.modelo, color: d.color, precioUSD: d.precioUSD,
      concesionaria: d.concesionaria, ejecutivoVentas: d.ejecutivoVentas,
      telefonoPais: d.telefonoPais, telefono: d.telefono,
      evento: d.evento, cuotasInicial: d.cuotasInicial,
      inicialTotal: d.pagos.inicialTotal, bonoEmpresa: d.pagos.bonoEmpresa,
    });
    if (d.pdfUrl) { this.pdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(d.pdfUrl); this.pdfName = d.pdfName || 'Documento.pdf'; }
  }

  onPickClick(e: MouseEvent) { e.stopPropagation(); this.fileInput?.nativeElement.click(); }
  onSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.validateAndSet(f);
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }
  onDragOver(evt: DragEvent, s: boolean) { evt.preventDefault(); this.dragOver = s; }
  onDrop(evt: DragEvent) { evt.preventDefault(); this.dragOver = false; this.validateAndSet(evt.dataTransfer?.files?.[0] ?? null); }
  removeFile(evt?: MouseEvent) { evt?.stopPropagation(); this.clearFileOnly(); this.pdfName = ''; this.pdfSafeUrl = null; }

  private validateAndSet(file: File | null) {
    const c = this.form.get('file')!;
    if (!file) { this.clearFileOnly(); return; }
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
    if (!isPdf) { c.setErrors({ invalidType: true }); c.markAsTouched(); return; }
    const max = this.maxSizeMB * 1024 * 1024;
    if (file.size > max) { c.setErrors({ maxSize: true }); c.markAsTouched(); return; }
    c.setValue(file); c.setErrors(null);
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(file);
    this.pdfSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
    this.pdfName = file.name || 'Documento.pdf';
  }
  private clearFileOnly() {
    const c = this.form.get('file')!;
    c.setValue(null); c.setErrors(null);
    if (this.objectUrl) { URL.revokeObjectURL(this.objectUrl); this.objectUrl = undefined; }
  }

  get displayPdfName(): string {
    const name = this.pdfName || '';
    if (!name) return '';
    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.slice(0, dot) : name;
    const short = base.length > 12 ? base.slice(0, 12) + ' ... ' : base + ' ';
    return `${short}.pdf`;
  }

  onAddDocument() {
    if (!this.proformaId) { return; }
    this.router.navigate(['/profile/ambassador/my-awards/car-bonus/proforma', this.proformaId, 'document', 'new']);
  }

  confirmOpen = false;
  confirmMessage = 'Estás a punto de enviar tus proformas al sistema para su validación. Verifica que la información sea correcta.';

  confirmBullets = [
    'Datos del vehículo (marca, modelo, color)',
    'Información de contacto',
    'Ejecutivo de ventas asignado',
    'Empresa/concesionaria',
  ];

  onSave() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.confirmOpen = true;
  }

  closeConfirm() { this.confirmOpen = false; }

  confirmSend() {
    this.confirmOpen = false;
    this.resultTitle = 'Registro exitoso';
    this.resultMessage = 'Tu proforma fue enviada exitosamente. Nos comunicaremos contigo para confirmar la aprobación y enviarte el cronograma de tu cuota inicial.';
    this.resultIcon = 'success';
    this.resultInfoMessage = 'Recuerda: Puedes agregar una segunda proforma o editar la actual desde "Proformas" hasta el 30 de septiembre de 2025.';
    this.resultOpen = true;
  }

  resultOpen = false;
  resultTitle = '';
  resultMessage = '';
  resultIcon: 'success' | 'error' | 'info' | 'warning' = 'success';
  resultInfoMessage = '';

  toggleCountryMenu(evt: Event) {
    evt.stopPropagation();
    if (evt instanceof KeyboardEvent) { evt.preventDefault(); }
    this.countryMenuOpen = !this.countryMenuOpen;
  }

  selectCountry(country: { iso: string; dial: string; flag: string }, evt: Event) {
    evt.stopPropagation();
    if (evt instanceof KeyboardEvent) { evt.preventDefault(); }
    this.form.get('telefonoPais')?.setValue(country.dial);
    this.countryMenuOpen = false;
  }

  @HostListener('document:click')
  closeCountryMenu() {
    if (this.countryMenuOpen) {
      this.countryMenuOpen = false;
    }
  }

  onBack() {
    this.router.navigate(['/profile/ambassador/my-awards/car-bonus/proforma']);
  }

  get selectedCountry() {
    const dial = this.form.value.telefonoPais;
    return this.countries.find(c => c.dial === dial) ?? this.countries[0];
  }

  ngOnDestroy() { if (this.objectUrl) URL.revokeObjectURL(this.objectUrl); }
}
