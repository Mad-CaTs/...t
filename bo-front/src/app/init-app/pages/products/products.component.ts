import { Component, OnDestroy, OnInit } from '@angular/core';

import type { Subscription } from 'rxjs';

import { ActivatedRoute, Params, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
/* import { NavigationModule } from '@shared/components/navigation/navigation.module';
import { INavigation } from '@interfaces/ambassador';
import { ProductsComponentsModule } from '../../components/products/products.module';
import { OptimizationModule } from '@shared/optimization/optimization.module'; */
import { LanguajesService } from '@init-app/services';
import { OptimizationModule } from '@init-app/optimization/optimization.module';
import { INavigation } from '@init-app/interfaces';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { ProductCardComponent } from './commons/components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    ProductCardComponent,
    OptimizationModule,
  ],
})
export default class ProductsComponent implements OnInit, OnDestroy {
  public selected;
  private subs: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private language: LanguajesService
  ) {}

  ngOnInit(): void {
    this.subs = this.route.queryParams.subscribe((q) => this.watchQuery(q));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public watchQuery(query: Params) {
    const section = query['s'];

    if (section === 'tech') this.selected = 2;
    else if (section === 'other') this.selected = 3;
    else this.selected = 1;
  }

  public navigateToSelected(id: number) {
    if (id === 1) this.router.navigateByUrl('/home/products?s=estate');
    else if (id === 2) this.router.navigateByUrl('/home/products?s=tech');
    else if (id === 3) this.router.navigateByUrl('/home/products?s=other');
  }

  get lang() {
    return this.language.languageSelected.products;
  }

  get navigation(): INavigation[] {
    return this.lang.navigation.map((n, i) => ({ id: i + 1, text: n }));
  }
}
