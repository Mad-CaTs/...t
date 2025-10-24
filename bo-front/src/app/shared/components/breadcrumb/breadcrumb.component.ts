import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: BreadcrumbItem[] = [];


}
