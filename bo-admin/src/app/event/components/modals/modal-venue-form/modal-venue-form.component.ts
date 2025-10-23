import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMapPickerComponent } from '../modal-map-picker/modal-map-picker.component';
import { CountryService, CountryOption } from '../../../services/country.service';

@Component({
  standalone: true,
  selector: 'app-modal-venue-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-venue-form.component.html',
  styleUrls: ['./modal-venue-form.component.scss']
})
export class ModalVenueFormComponent implements OnInit, OnChanges {
  @Input() title: string = 'Agregar lugar';
  @Input() initialData?: { country: string; city: string; nameVenue: string; address: string; latitude?: number; longitude?: number; status: boolean };
  @Output() save = new EventEmitter<{ country: string; city: string; nameVenue: string; address: string; latitude: number; longitude: number; status: boolean }>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  isEdit = false;

  // País (dropdown con búsqueda)
  countries: CountryOption[] = [];
  filteredCountries: CountryOption[] = [];
  selectedCountry: CountryOption | null = null;
  countryOpen = false;
  highlightedIndex = 0;
  @ViewChild('countryBox') countryBox!: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private modalService = inject(NgbModal);
  private cd = inject(ChangeDetectorRef);
  private countrySrv = inject(CountryService);

  constructor() {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData']) this.loadInitialData();
  }

  private createForm(): void {
    this.form = this.fb.group({
      country: ['', Validators.required],
      city: ['', Validators.required],
      nameVenue: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      status: [true, Validators.required]
    });
  }

  private loadInitialData(): void {
    if (this.initialData) {
      this.isEdit = true;
      this.form.patchValue(this.initialData);
      const nicename = this.initialData.country?.toLowerCase();
      if (nicename && this.countries.length) {
        this.selectedCountry = this.countries.find(c => c.nicename.toLowerCase() === nicename) ?? null;
      }
    } else {
      this.isEdit = false;
      this.form.reset({ country: '', city: '', nameVenue: '', address: '', latitude: null, longitude: null, status: true });
    }
  }

  private loadCountries(): void {
    this.countrySrv.getCountries().subscribe({
      next: (list) => {
        this.countries = list;
        this.filteredCountries = list;
        const nicename = (this.form.get('country')?.value || '').toLowerCase();
        if (nicename) {
          this.selectedCountry = this.countries.find(c => c.nicename.toLowerCase() === nicename) ?? null;
          this.cd.detectChanges();
        }
      },
      error: () => {
        this.countries = [];
        this.filteredCountries = [];
      }
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
  }

  onCloseClick(): void {
    this.close.emit();
  }

  preventLeadingSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === ' ' && input.selectionStart === 0) event.preventDefault();
  }

  onOpenMapPicker(): void {
    const modalRef = this.modalService.open(ModalMapPickerComponent, { centered: true, size: 'lg', backdrop: 'static' });
    const lat = this.form.get('latitude')?.value;
    const lng = this.form.get('longitude')?.value;
    if (lat && lng) modalRef.componentInstance.initialCoordinates = [lng, lat];

    modalRef.result.then((coords: [number, number]) => {
      if (coords && coords.length === 2) {
        this.form.patchValue({ latitude: coords[1], longitude: coords[0] });
        this.form.get('latitude')?.markAsDirty();
        this.form.get('latitude')?.markAsTouched();
        this.form.get('longitude')?.markAsDirty();
        this.form.get('longitude')?.markAsTouched();
        this.form.markAsDirty();
        this.form.get('latitude')?.updateValueAndValidity();
        this.form.get('longitude')?.updateValueAndValidity();
        this.form.updateValueAndValidity();
        this.cd.detectChanges();
      }
    }).catch(() => {});
  }

  /* ===== País: handlers ===== */
  openCountry() { this.countryOpen = true; }
  toggleCountry() { this.countryOpen = !this.countryOpen; }
  closeCountry() { this.countryOpen = false; this.highlightedIndex = 0; }

  onCountryInput(evt: Event) {
    const q = (evt.target as HTMLInputElement).value.toLowerCase().trim();
    this.filteredCountries = !q
      ? this.countries
      : this.countries.filter(c => c.nicename.toLowerCase().includes(q) || c.courtesy?.toLowerCase().includes(q));
    this.openCountry();
    this.highlightedIndex = 0;
    this.selectedCountry = null;
    this.form.get('country')?.markAsDirty();
  }

  selectCountry(c: CountryOption) {
    this.selectedCountry = c;
    this.form.patchValue({ country: c.nicename }); // guardas nicename
    this.form.get('country')?.markAsDirty();
    this.form.get('country')?.markAsTouched();
    this.closeCountry();
  }

  onCountryKeydown(ev: KeyboardEvent) {
    if (!this.countryOpen && (ev.key === 'ArrowDown' || ev.key === 'Enter')) {
      ev.preventDefault();
      this.openCountry();
      return;
    }
    if (!this.countryOpen) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredCountries.length - 1);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      const c = this.filteredCountries[this.highlightedIndex];
      if (c) this.selectCountry(c);
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      this.closeCountry();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (!this.countryBox) return;
    const el = this.countryBox.nativeElement;
    if (!el.contains(e.target as Node)) this.closeCountry();
  }
}
