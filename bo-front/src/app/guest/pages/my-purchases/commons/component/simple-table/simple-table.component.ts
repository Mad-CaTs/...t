import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-simple-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './simple-table.component.html',
  styleUrl: './simple-table.component.scss'
})
export class SimpleTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() scrollable: boolean = true;
  @Input() scrollHeight: string = '400px';
  @Input() tableStyleClass: string = 'p-datatable-sm';
  @Input() showDebugInfo: boolean = false; // Para debugging
  
  @ContentChild('bodyTemplate') bodyTemplate?: TemplateRef<any>;

  constructor() {
    // Debug en constructor
    console.log('🎯 SimpleTableComponent creado');
  }

  ngOnInit() {
    console.log('📊 SimpleTable inicializado:', {
      dataLength: this.data?.length,
      columnsLength: this.columns?.length,
      scrollHeight: this.scrollHeight
    });
  }

  ngOnChanges() {
    console.log('🔄 SimpleTable datos actualizados:', {
      dataLength: this.data?.length,
      data: this.data
    });
  }
}
