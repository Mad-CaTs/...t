import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-car-bonus',
  standalone: true,
  imports: [],
  templateUrl: './car-bonus.component.html',
  styleUrl: './car-bonus.component.scss'
})
export class CarBonusComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  openProformas() {
    this.router.navigate(['proforma'], { relativeTo: this.route });
  }

}
