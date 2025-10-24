import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class MyProductsComponent {}
