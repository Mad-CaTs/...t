import { Component, OnDestroy, OnInit } from '@angular/core';
import type { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OptimizationModule } from '@init-app/optimization/optimization.module';
import { LanguajesService } from '@init-app/services';
import { Products } from '../../constants';
import { VideoComponent } from '@init-app/components/video/video.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    MatIconModule,
    VideoComponent,
    OptimizationModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export default class ProductDetailComponent implements OnInit, OnDestroy {
  private productParam: string = 'ribera';

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private language: LanguajesService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((p) => this.watchParams(p))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private watchParams(params: Params) {
    const param = params['product'];
    const product = this.Products.find((p) => p.path === param);

    if (!product) this.router.navigate(['/products']);
    else this.productParam = param;
  }

  /* === Getters === */
  get lang() {
    return this.language.languageSelected.productDetail;
  }

  get data() {
    const product = this.Products.find((p) => p.path === this.productParam);

    return product;
  }

  get Products() {
    const products = [...this.lang.products];

    return this.lang.products.map((p, i) => ({
      ...p,
      path: Products[i].path,
      coverImage: Products[i].coverImage,
      aboutImg: Products[i].aboutImg,
      aboutUrl: Products[i].aboutUrl,
      videoUrl: Products[i].videoUrl,
      cards: products[i].cards.map((c, cI) => ({
        ...c,
        bg: Products[i].cards[cI].bg,
      })),
    }));
  }
}
