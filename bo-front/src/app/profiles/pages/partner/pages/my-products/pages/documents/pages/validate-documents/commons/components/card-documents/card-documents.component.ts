import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-documents.component.html',
  styleUrl: './card-documents.component.scss'
})
export class CardDocumentsComponent {
  @Input() document: any;
}
