import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LanguajesService } from '@init-app/services';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { OptimizationModule } from '@init-app/optimization/optimization.module';

@Component({
  selector: 'app-upgrades',
  templateUrl: './upgrades.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    UpgradesComponent,
    OptimizationModule,
    RouterOutlet,
  ],
})
export default class UpgradesComponent {
  public selected = 1;

  constructor(private language: LanguajesService) {}

  get navigation() {
    return [{ id: 1, text: this.language.languageSelected.news.noticeLabel }];
  }
}
