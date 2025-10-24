import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { Subject, takeUntil, tap } from 'rxjs';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';

@Component({
  selector: 'app-document-detail-item',
  standalone: true,
  imports: [CommonModule,SelectComponent],
  templateUrl: './document-detail-item.component.html',
  styleUrl: './document-detail-item.component.scss'
})
export class DocumentDetailItemComponent implements OnChanges{
  @Input() iconPath!: string; 
  @Input() title!: string;
  @Input() descripcion!: string;
  @Input() idResidenceCountry?: number;
  @Input() nationalitiesList: any[] = [];

  private destroy$: Subject<void> = new Subject<void>();
  form = new FormGroup({
    idResidenceCountry: new FormControl(null),
  });
constructor(private newPartnerService:NewPartnerService){}


ngOnChanges(changes: SimpleChanges): void {
  console.log('[ngOnChanges] cambios detectados:', changes);

  if (
    changes['idResidenceCountry'] ||
    changes['nationalitiesList']
  ) {
    console.log('[ngOnChanges] this.title:', this.title);
    console.log('[ngOnChanges] this.idResidenceCountry:', this.idResidenceCountry);
    console.log('[ngOnChanges] this.nationalitiesList:', this.nationalitiesList);

    if (
      this.title === 'País' &&
      this.idResidenceCountry &&
      this.nationalitiesList.length > 0
    ) {
      console.log('[ngOnChanges] Aplicando patchValue con:', {
        idResidenceCountry: this.idResidenceCountry
      });

      this.form.patchValue({
        idResidenceCountry: this.idResidenceCountry
      });
      this.form.get('idResidenceCountry')?.disable();

    }
  }
}
}

 

  /*   getNationalities() {
      this.newPartnerService
        .getCountriesList()
        .pipe(
          takeUntil(this.destroy$),
          tap((paises) => (this.nationalitiesList = paises))
        )
        .subscribe();
        console.log("nationalitiesList",this.nationalitiesList)
    } */

/*   nationalitiesList = [
    { content: 'Perú', value: 167, img: 'assets/icons/flags/peru.svg' },
    { content: 'Colombia', value: 57, img: 'assets/icons/flags/colombia.svg' },
    { content: 'Chile', value: 56, img: 'assets/icons/flags/chile.svg' }
  ]; */




