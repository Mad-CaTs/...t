import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MainLayoutComponent } from '../../commons/layout/main-layout/main-layout.component';
import { ambassadorRoutes } from './commons/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ambassador',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  templateUrl: './ambassador.component.html',
  styleUrl: './ambassador.component.scss',
})
export class AmbassadorComponent {
 /*  @ViewChild('item') headerTpl: TemplateRef<HTMLDivElement>;
  @ViewChild('layout') layout: MainLayoutComponent;
 */
  public routes = ambassadorRoutes;

  constructor() {}

  /* ngAfterViewInit() {
    Promise.resolve().then(() =>
      this.layout.setHeaderItemsTemplate(this.headerTpl)
    );
  } */
}