import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-bordered-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bordered-table.component.html',
  styleUrl: './bordered-table.component.scss'
})
export class BorderedTableComponent {
  @Input() headers: string[] = [];
  @Input() rows: any[] = []; 
  @ContentChild('body', { static: false }) bodyTemplate!: TemplateRef<any>;
 


}
