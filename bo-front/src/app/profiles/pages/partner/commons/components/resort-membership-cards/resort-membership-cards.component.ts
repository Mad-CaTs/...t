import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MembershipCardComponent } from '../membership-card/membership-card.component';
import { LegalizationService } from '../../../pages/my-legalization/commons/services/legalization.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { ISelect } from '@shared/interfaces/forms-control';

@Component({
  selector: 'app-resort-membership-cards',
  standalone: true,
  imports: [CommonModule,MembershipCardComponent],
  templateUrl: './resort-membership-cards.component.html',
  styleUrl: './resort-membership-cards.component.scss'
})
export class ResortMembershipCardsComponent implements OnChanges{
  @Input() products: any[] = [];
  resorts: any[] = [];
  @Output() accionDesdeMembresia = new EventEmitter<{ tipo: string, data: any }>();
  @Input() stateColors: Record<number, string> = {};
  private destroy$: Subject<void> = new Subject<void>();
  public legalizationDocList: ISelect[];
  documentTypesLoaded = false;

  constructor(private legalizationService: LegalizationService){}

  ngOnInit() {
    this.loadDocumentTypes();
    console.log('resortsenngOnInit:', this.resorts);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.products.length) {
      this.groupProductsByResort();
    }
  }

  groupProductsByResort() {
    console.log('📦 Productos recibidos:', this.products);

    const grouped = new Map<number, { name: string, memberships: any[] }>();
  
    for (const product of this.products) {
      const idFamily = product.idFamilyPackage;
      const familyName = product.familyPackageName || 'Sin nombre';
  
      if (!grouped.has(idFamily)) {
        console.log('🆕 Nueva familia:', idFamily, familyName);
        grouped.set(idFamily, { name: familyName, memberships: [] });
      }
  
      console.log('➕ Agregando producto a familia', idFamily, product);
  
      grouped.get(idFamily)!.memberships.push(product);
    }
  
    this.resorts = Array.from(grouped.values());
  
    console.log('✅ Resultado final agrupado:', this.resorts);
  }
  
  


  handleAccionSeleccionada(event: { tipo: 'contrato' | 'certificado', data: any }) {
    console.log('📤 Propagando hacia el componente padre:', event);
    this.accionDesdeMembresia.emit(event);
  }

  private loadDocumentTypes(): void {
    this.documentTypesLoaded = true; // 🟡 loader activo
  
    this.legalizationService.getDocumentTypes().subscribe({
      next: (types) => {
        this.legalizationDocList = types;
        this.documentTypesLoaded = false; // ✅ listo para mostrar el contenido
      },
      error: (err) => {
        console.error('Error al cargar tipos de documentos', err);
        // ❌ No lo seteamos en true, porque hubo error. El loader se queda girando.
      }
    });
  }
  

  

}
